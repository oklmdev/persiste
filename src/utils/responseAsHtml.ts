import { Response } from 'express'
import ReactDOMServer from 'react-dom/server'

const html = String.raw

export function responseAsHtml(element: JSX.Element, { response }: { response: Response }) {
  if (element === null) {
    return
  }

  response.send(html`
    <html class="h-full bg-gray-100">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="/bundle.css" rel="stylesheet" />
      </head>
      <body class="h-full overflow-hidden">
        ${ReactDOMServer.renderToString(element)}
      </body>
    </html>
  `)
}
