const renderPage = (title,heading,demoString) => `
    <!DOCTYPE html>
    <html lang="da">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body>
        <!-- page content -->
        <h1>${heading}</h1>
        <script>
          console.log(${demoString});
        </script>
      </body>
    </html>
`

console.log(renderPage("My Page","Hello World","'Hello World'"));