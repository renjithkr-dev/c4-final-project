import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = '...'

const cert=`-----BEGIN CERTIFICATE-----
MIIDAzCCAeugAwIBAgIJIWEJqUkhBzafMA0GCSqGSIb3DQEBCwUAMB8xHTAbBgNV
BAMTFG15dGVjaDYudXMuYXV0aDAuY29tMB4XDTIxMDEyMDA5MTE1NloXDTM0MDky
OTA5MTE1NlowHzEdMBsGA1UEAxMUbXl0ZWNoNi51cy5hdXRoMC5jb20wggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDdZiq3hYhvBbKGwMPYwDpwLO7el6Jv
Du5wWktWRsNyG9hmUgXhSOsiyVU9a74Egz4dDoRzzAlubEmwJFJAasq0Fl233SIv
J/VCmwwy4tVHKI61F3vgNd54bEJPCBT55AE6nXKBtLhCGZS4EBApnJeXc1J6p8N7
fcNSg68oi5XuikdwGZLFswgQLJ4u0pOZDVIQDTyNeSUNPdIcfXczDUb/Uiz7G40+
QbVtB78ehZajBS4fn54VqywJmvdGYpnxjpK7rnKV5Rl3VS8EJ+OFetH0JKVBcwM0
W8K9YqWUJXuXiisly8J77ZHSSH9iNUeOh9eAOwYITfTCXCnF+KkYK6ARAgMBAAGj
QjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFJ9/XhH+/rEiaejScqKe7cIS
Bdx2MA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAZC3oQQkwru36
m31DSnp6ej73rTIikkP5UOEwAI5Q10HACNwhAjPfnmCqCIfcq4rVkCXLC4o4MMOp
EgMWeKV6W1NPzvxvz4qrShx3le66Jm/c5Gj/hdmZpLY6ODrhumPqRiEQVSWavsXA
ER78EW28pAt8m4jIrshrRdaWHgWDRsLVdMrg2JUeyK/aMEQBlqP8q1YNoCXQg7r8
g6g6f4c/eypzluhTtcUlOQISSI+A7mBt79CaqTi8AdM8rGcGNF/V/yMRmSN58qO1
CfeQyplYC2jo9oXmZn2V8IH4UPNnQPZ3mHjWF4ARkhLs8AO9Oo0iLH9udb0Gkdlh
Ao4KF/Ao/w==
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

  return verify(token,cert,{algorithms:['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
