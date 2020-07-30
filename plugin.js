const crypto = require('crypto'); // Node.js core lib

// Insomnia template tags

module.exports.templateTags = [
  {
    name: 'apiauthRuby',
    displayName: 'ApiAuth Ruby',
    description: 'Generate authorization headers for use with the ApiAuth Ruby Library',
    args: [
      {
        displayName: 'Key ID',
        description: 'API key ID string',
        type: 'string',
        placeholder: '1',
      },
      {
        displayName: 'Key Secret',
        description: 'API key secret string',
        type: 'string',
        placeholder: '(n_character_long_string)',
      }
    ],
    async run(context, keyId, keySecret) {
      // Generates the live preview within the edit tag dialog
      if (!keyId) throw new Error('missing key id');
      if (!keySecret) throw new Error('missing key secret');
      await Promise.all([
        context.store.setItem("keyId", keyId),
        context.store.setItem("keySecret", keySecret)
      ])
      return "Live preview not available..."
    }
  }
];

// Insomnia request hooks

module.exports.requestHooks = [async (context) => {
  // Get params from template fields
  const keyId = await context.store.getItem("keyId");
  const keySecret = await context.store.getItem("keySecret");
  const payload = context.request.getBody().text || ''

  // Build up request header data
  const now = new Date().toUTCString();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'text/plain',
    'Date': now,
    'Content-MD5': crypto.createHash('md5')
      .update(Buffer.from(payload, 'utf-8'))
      .digest('hex')
  };

  // Sign request per APIAuth specs
  const canon = canonicalString(headers, context.request.getUrl());
  const signature = requestSignature(canon, keySecret);
  const auth = authorizationHeader(keyId, signature);

  // Set request headers
  context.request.setHeader('Content-Type', headers['Content-Type']);
  context.request.setHeader('Accept', headers['Accept']);
  context.request.setHeader('Content-MD5', headers['Content-MD5']);
  context.request.setHeader('Date', headers['Date']);
  context.request.setHeader('Authorization', auth);
}];

// Utility functions

function canonicalString(headers, url) {
  console.log("ApiAuth: building canonical string");
  const uriWithoutHostRegexp = new RegExp('https?://[^,?/]*');
  let uriWithoutHost = ''
  if (url.match(uriWithoutHostRegexp)) uriWithoutHost = url.replace(uriWithoutHostRegexp, '');
  if (!uriWithoutHost) uriWithoutHost = '/';
  const components = [
    headers['Content-Type'],
    headers['Content-MD5'],
    uriWithoutHost,
    headers['Date']
  ];
  return components.join(',')
}

function requestSignature(canon, keySecret) {
  console.log("ApiAuth: signing request");
  return Buffer.from(
    crypto.createHmac('sha1', Buffer.from(keySecret))
    .update(canon)
    .digest('base64')
  ).toString('utf-8')
}

function authorizationHeader(keyId, signature) {
  console.log("ApiAuth: building authorization header");
  return `APIAuth ${keyId}:${Buffer.from(signature).toString('utf-8')}`
}
