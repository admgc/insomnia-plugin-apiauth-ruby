#  APIAuth (Ruby) for Insomnia

This is a plugin for [Insomnia](https://insomnia.rest/) that makes authenticating to ApiAuth HMAC protected endpoints simple.
It is tailored specifically to be used in conjunction with URLs that implement the [APIAuth](https://github.com/mgomes/api_auth)
Ruby library server-side.

## Prerequisites

Works with ApiAuth 1.4.0+. Untested with ApiAuth 2.0.0+

##  Installation

Install the `insomnia-plugin-apiauth-ruby` plugin via `Insomnia -> Preferences -> Plugins`.

##  Use

1. Go to the `Header` tab of your request.
1. Click in the `New Header` field, type `Authorization` (or press `ctrl-space` and choose `Authorization` from the dropdown)
1. Click in the `New Value` field, type `ApiAuth Ruby` (or press `ctrl-space` and choose `ApiAuth Ruby` from the dropdown)
1. Click on the `ApiAuth Ruby` tag to open the `Edit Tag` dialog. 
1. Fill in the fields.
1. Make your request as usual.
