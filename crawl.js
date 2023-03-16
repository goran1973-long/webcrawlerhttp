const {JSDOM} = require('jsdom')


async function crawlPage(currentURL) {
  console.log(`Actively crawling: ${currentURL}`)

  try {
    const resp = await fetch(currentURL)

    if (resp.status > 399) {
        return console.log(`Error in fetch with status code: ${resp.status} on page: ${currentURL}`)
        
    }

    const contentType = resp.headers.get("content-type")

    if (!contentType.includes("text/html")) {
        console.log(`Non html response, content type: ${contentType} on a page ${currentURL}`)
        return
    }

    console.log(await resp.text())
    
  } catch (error) {
    console.log(`Error in fetch: ${error.message}, on page: ${currentURL}`)
  }
  

}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements) {
                                                   //Znaci ako a href = "invalid" Browser to vidi kao "/" jer mu u ankoru 
                                                   //na kraju stoji samo slash. !!!
        
        if (linkElement.href.slice(0, 1) === '/') {
            //Relative URL

            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            } catch (error) {
                console.log(`Error with relative url: ${error.message}`)
            }
           
        } else {
            //Absolute URL
            try {
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            } catch (error) {
                console.log(`Error with absolute url: ${error.message}`)
            }
        }
        
        }

        return urls
}




function normalizeURL(urlString) {
   const urlObj = new URL(urlString)
   const hostPath = `${urlObj.hostname}${urlObj.pathname}`
   if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0,-1)
   }
   return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}