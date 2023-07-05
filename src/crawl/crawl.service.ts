import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import moment from "moment";
import puppeteer from "puppeteer";
import { skip } from "rxjs";
import {convertMinToSecond} from "src/helper/convertTime.helper";
import { PrismaService } from "src/prisma/prisma.service";
import { RacerDto } from "src/racer/dto";
import { RacerService } from "src/racer/racer.service";
import { isString } from "util";

@Injectable ({})
export class CrawlService {
  constructor(private config: ConfigService) {}
  async crawlRacerData():Promise<{data: Array<object>}> {
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
          return {name, href}
        })
      });
      
      await browser.close();
      return dhhData
    }) ();
    
    return {data: data}
  }

  async crawlTeamData():Promise<{data: Array<object>}> {
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
          const logo = line.getElementsByClassName('logo')[0].getElementsByTagName('img')[0].getAttribute('data-src')
          const car = line.getElementsByClassName('listing-image')[0].getElementsByTagName('img')[0].getAttribute('data-src');
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

  async crawlRacerScheduleData() {
    try {
      const url = this.config.get('F1_URL') + `/results.html/${2023}/races/1141/bahrain/race-result.html`
      const data = await (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);
        
        const dhhData = await page.evaluate(() => {
          const table = document.getElementsByClassName('resultsarchive-table')[0].getElementsByTagName('tbody')
          
          const lines = table[0].children; //Lấy mảng tr nằm trong tbody
          return [...lines].map((line, idx) => {
            const rank = line.getElementsByClassName('dark')[0].innerHTML
            const name = line.getElementsByClassName('dark bold')[0].children[0].innerHTML + ' ' + line.getElementsByClassName('dark bold')[0].children[1].innerHTML
            let time
            if (idx == 0 || line.children[6].innerHTML == 'DNF') {
              time = line.children[6].innerHTML
            }
            else {
              time = (line.children[6].innerHTML).split(/[+<]/)[1]
            }
            const pts = line.children[7].innerHTML
            
            return {rank, name, pts, time, idx}
          })
        });
        
        await browser.close();
        let currentTime = convertMinToSecond(dhhData[0]['time'])
        
        dhhData.forEach((data, idx) => {
          if (idx != 0) {
            currentTime += parseFloat(data['time'])
            data['timeRace'] = currentTime
          }
          else {
            data['timeRace'] = currentTime
          }

        })
        return dhhData
      }) ();
      
      return {data: data}
    } catch (error) {
      console.log(error);
      
    }
  }
}