import { ForbiddenException, Injectable } from "@nestjs/common";
import axios from "axios";
import puppeteer from "puppeteer";
import { isString } from "util";

@Injectable ({})
export class CrawlService {
  constructor() {}
  async crawlData() {
    const url = 'https://www.formula1.com/en/drivers.html';
    console.log(url);
    let dhhData;
    (async () => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url);
      
      dhhData = await page.evaluate(() => {
        let result = [];
        const table = document.getElementsByClassName('container listing-items--wrapper driver during-season')
  
        const lines = table[0].children[0].children; //Lấy mảng tr nằm trong tbody
        [...lines].map(line => {
          const name = line.getElementsByClassName('d-block f1--xxs f1-color--carbonBlack')[0].innerHTML + ' ' + line.getElementsByClassName('d-block f1-bold--s f1-color--carbonBlack')[0].innerHTML
          const rank = line.getElementsByClassName('rank')[0].innerHTML //.children[0].children[0].children[0].innerHTML
          const pts = line.getElementsByClassName('f1-wide--s')[0].innerHTML
          const href = line.getElementsByClassName('listing-item--link')[0].getAttribute('href')
          const team = line.getElementsByClassName('listing-item--team f1--xxs f1-color--gray5')
          result.push(name, rank, pts, href)
        })
        return result;
      });
      
      console.log('end');
      console.log(dhhData);
      await browser.close();
    }) ();
    
    return {data: dhhData}
  }
}

//table[12].children[0]
//racer href name country team DoB ava