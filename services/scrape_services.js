const rp = require('request-promise');
const tough = require('tough-cookie');
const cheerio = require("cheerio")
const axios = require("axios")

class ScrapeService {
    constructor(tab = "designs") {
        this.tab = tab;
        this.cookieJar = rp.jar(); // Initialize a cookie jar to store cookies
        // this.baseUrl = "http://wipopublish.ipvietnam.gov.vn/";
        this.baseUrl =process.env.BASE_URL;
    }

    async accessWeb() {
        console.log("accessWeb: ");

        try {
            // Make the request
            const response = await rp.get(this.baseUrl+'wopublish-search/public/' + this.tab + '?&query=*:*', {
                headers: {
                    'Accept': 'application/xml, text/xml, */*; q=0.01',
                    'Accept-Language': 'vi-VN,vi;q=0.9'
                    // Add other headers as needed
                },
                jar: this.cookieJar, // Use the cookie jar to store and send cookies
                resolveWithFullResponse: true // To get the full response including headers
            });

            // Retrieve and print the response body
            const responseBody = response.body;

            console.log("cookies String: "+ this.createCookieString())

            return responseBody ? true : false;
        } catch (error) {
            console.error("Error accessing web:", error);
            return false;
        }
    }



    createCookieString(keys = []) {
        const cookies = this.cookieJar._jar.serializeSync().cookies;

        return cookies.map(cookie => `${cookie.key}=${cookie.value}`).join(';');
    }

    getJSESSIONID() {
        const cookies = this.cookieJar._jar.serializeSync().cookies;

        const jsessionidCookie = cookies.find(cookie => cookie.key === "JSESSIONID");
        return jsessionidCookie ? jsessionidCookie.value : null;
    }


    async nextPage() {
        console.log("===========> scraping next page :"+ this.getJSESSIONID())


        // const url = 'http://wipopublish.ipvietnam.gov.vn/wopublish-search/public/'+this.tab+'?0-1.IBehaviorListener.0-body-searchResultPanel-resultWrapper-dataTable-bottomToolbars-toolbars-2-span-navigator-next&query=*:*&_='+new Date().getTime();

        const  url= this.baseUrl+"wopublish-search/public/designs?0-1.IBehaviorListener.0-body-searchResultPanel-resultWrapper-dataTable-bottomToolbars-toolbars-2-span-navigator-next&query=*:*&_=1705991321860";
        console.log("url: "+ url)
        console.log("cookies: "+ this.createCookieString())

        const response = await axios.get(url,{
           headers:{
               'Connection': 'keep-alive',
               'Cookie': this.createCookieString(),
               'Wicket-Ajax': 'true',
               'Wicket-Ajax-BaseURL': `public/${this.tab}?0&amp;query=*:*`
           },
        });

        const responseBody= response.data
        console.log("response: "+ responseBody)

        let htmlContent = responseBody;

        let cdataStart = htmlContent.indexOf("<![CDATA[");
        let cdataEnd = htmlContent.indexOf("]]>");

        if (cdataStart !== -1) {
            if (cdataEnd !== -1) {
                // Case: <![CDATA[ ... ]]>
                htmlContent = htmlContent.substring(cdataStart + 9, cdataEnd);
            } else {
                // Case: <![CDATA[ ... (no closing ]]>)
                htmlContent = htmlContent.substring(cdataStart + 9);
            }
        }

// Parse HTML content with Cheerio
        const $ = cheerio.load(htmlContent);

        const pageNumbers = [];

        $('tbody tr').each((index, element) => {
            const pageNumber = $(element).attr('id');
            pageNumbers.push(pageNumber);
        });

        console.log(pageNumbers);
    }


    async accessWeb2() {
        console.log("================> accessWeb2: ");

        const url = this.baseUrl+"wopublish-search/public/" + this.tab + ";jsessionid=" +this.getJSESSIONID() + "?0-1.IBehaviorListener.0-body-advancedSearchTab-advancedSearchInputPanel-advancedSearchForm-advancedSearchSubmitLink&query=*:*";

        const headers = {
            'Accept': 'application/xml, text/xml, */*; q=0.01',
            'Accept-Language': 'en',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': this.createCookieString(),
            'Origin': this.baseUrl,
            'Referer': this.baseUrl + "wopublish-search/public/" + this.tab + ";jsessionid=" + this.getJSESSIONID()+ "?0&query=*:*",
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Wicket-Ajax': 'true',
            'Wicket-Ajax-BaseURL': 'public/' + this.tab + '?0&amp;query=*:*',
            'Wicket-FocusedElementId': 'advanceSearchButton',
            'X-Requested-With': 'XMLHttpRequest'
        };

        return axios.get(url, { headers })
            .then(response => {
                // console.log("accessweb2: "+ response.data)
                return response.data;
            })
            .catch(error => {
                console.error("Error accessing web:", error);
                return null;
            });
    }
}



module.exports = ScrapeService;
