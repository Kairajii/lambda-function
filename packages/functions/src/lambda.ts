import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// chrome-aws-lambda handles loading locally vs from the Layer

import { APIGatewayProxyHandlerV2 } from "aws-lambda";

// This is the path to the local Chromium binary
const YOUR_LOCAL_CHROMIUM_PATH = "E:\\sstdev\\layer-chrome-aws-lambda\\tmp\\localChromium\\chromium\\win64-1185545\\chrome-win\\chrome.exe"

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    let result = null;
    let browser =  null;
  
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport : chromium.defaultViewport,
      executablePath : process.env.IS_LOCAL 
      ? YOUR_LOCAL_CHROMIUM_PATH 
      : await chromium.executablePath(),
      headless: false,
    })
  
  const page = await browser.newPage();
  await page.goto("https://www.nytimes.com/");
   page.setDefaultNavigationTimeout(90000)

   result = await page.title();
   console.log("Title",result);

  await browser.close();
  
  return {
    statusCode: 200,
    body: JSON.stringify({message : result,})
  }
  
  } catch(error:any) {
    if(browser !== null){
      await browser.close();
    }
    return {
      statusCode:400,
      body: JSON.stringify({
        error:true,
        message:error?.message,
      })
    }
  }
};



// // : process.env.IS_LOCAL 
// ? YOUR_LOCAL_CHROMIUM_PATH 