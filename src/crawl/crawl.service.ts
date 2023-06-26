import { ForbiddenException, Injectable } from "@nestjs/common";
import axios from "axios";
import puppeteer from "puppeteer";
import { isString } from "util";

@Injectable ({})
export class CrawlService {
  constructor() {}
  async crawlRacerData() {
    const url = 'https://www.formula1.com/en/drivers.html';

    const data = await (async () => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url);
      
      const dhhData = await page.evaluate(() => {
        const table = document.getElementsByClassName('container listing-items--wrapper driver during-season')
  
        const lines = table[0].children[0].children; //Lấy mảng tr nằm trong tbody
        return [...lines].map(line => {
          const name = line.getElementsByClassName('d-block f1--xxs f1-color--carbonBlack')[0].innerHTML + ' ' + line.getElementsByClassName('d-block f1-bold--s f1-color--carbonBlack')[0].innerHTML
          const rank = line.getElementsByClassName('rank')[0].innerHTML //.children[0].children[0].children[0].innerHTML
          const pts = line.getElementsByClassName('f1-wide--s')[0].innerHTML
          const href = line.getElementsByClassName('listing-item--link')[0].getAttribute('href')
          const team = line.getElementsByClassName('listing-item--team f1--xxs f1-color--gray5')[0].innerHTML
          return {name, rank, pts, href, team}
        })
      });
      
      await browser.close();
      return dhhData
    }) ();
    
    return {data: data}
  }

  async crawlTeamData() {
    const url = 'https://www.formula1.com/en/teams.html';

    const data = await (async () => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url);
      
      const dhhData = await page.evaluate(() => {
        const table = document.getElementsByClassName('container listing team-listing')
  
        const lines = table[0].children[0].children; //Lấy mảng tr nằm trong tbody
        return [...lines].map(line => {
          const name = line.getElementsByClassName('f1-color--black')[0].innerHTML
          const pts = line.getElementsByClassName('f1-wide--s')[0].innerHTML
          const href = line.getElementsByClassName('listing-link')[0].getAttribute('href')
          const logo = line.getElementsByClassName('logo')[0].getElementsByTagName('img')[0].getAttribute('src')//[0].getAttribute('src')
          const car = line.getElementsByClassName('listing-image')[0].getElementsByTagName('img')[0].getAttribute('src');
          const racers = [...line.getElementsByClassName('listing-team-drivers')[0].children].map(racer => {
            return racer.children[0].children[0].innerHTML + ' ' + racer.children[0].children[1].innerHTML
          })
          return {name, pts, href, logo, car, racers}
        })
      });
      
      await browser.close();
      return dhhData
    }) ();
    
    return {data: data}
  }
}