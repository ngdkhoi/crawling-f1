import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { isNumber } from "class-validator";
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
  constructor(
    private config: ConfigService,
    private prisma: PrismaService
    ) {}
  async crawlRacerData(): Promise<{racers: Array<object>, year: number}> {
    const url = 'https://www.formula1.com/en/drivers.html';
    
    const data = await (async () => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url);
      
      const dhhData = await page.evaluate(() => {
        const table = document.getElementsByClassName('container listing-items--wrapper driver during-season')
        const year = document.getElementsByClassName('f1-border--top-right f1-border-color--carbonBlack')[0].getElementsByClassName('f1-black--xxl no-margin')[0].innerHTML.split(' ')[2]
        const lines = table[0].children[0].children; //Lấy mảng tr nằm trong tbody
        return {...{data: [...lines].map(line => {
          let nameHTML = line?.getElementsByClassName('col-xs-8 listing-item--name f1-uppercase driver-lastname-primary')[0]?.children || line.getElementsByClassName('col-xs-8 listing-item--name f1-uppercase')[0].children
          // nameHTML
          let name = null
          if (line?.getElementsByClassName('col-xs-8 listing-item--name f1-uppercase driver-lastname-primary')[0]?.children) {
            name = nameHTML[1].innerHTML + ' ' + nameHTML[0].innerHTML
          }
          else {
            name = nameHTML[0].innerHTML + ' ' + nameHTML[1].innerHTML
          }
          const rank = line.getElementsByClassName('rank')[0].innerHTML
          const pts = line.getElementsByClassName('f1-wide--s')[0].innerHTML
          const href = line.getElementsByClassName('listing-item--link')[0].getAttribute('href')
          const team = line.getElementsByClassName('listing-item--team f1--xxs f1-color--gray5')[0].innerHTML
          return {name, href, team, rank, pts}
        })}, ...{year: parseInt(year)}}
      });
      
      await browser.close();
      return {racers: dhhData.data, year: dhhData.year}
    }) ();
    
    return {racers: data.racers, year: data.year}
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

  async crawlRacerScheduleData(year, placeId) {
    try {
      const place = await this.prisma.schedules.findFirst({
        where: {
          AND: [
            {
              placeId: placeId
            },
            {
              season: {
                year: year
              }
            }
          ]
        }
      })
      
      
      if (!place) throw 'Cannot find place'
      const url = this.config.get('F1_URL') + `/results.html/${year}/races/${placeId}/bahrain/race-result.html`
      const data = await (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);
        
        const dhhData = await page.evaluate(() => {
          const dateSchedule = document.getElementsByClassName('full-date')[0].innerHTML
          if (new Date(dateSchedule) >= new Date()) return null
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
            const pts = parseInt(line.children[7].innerHTML)
            
            return {rank, name, pts, time}
          })
        });
        
        await browser.close();
        if (dhhData != null) {
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
        }
        
        return dhhData
      }) ();
      return {place: place, schedules: data}
    } catch (error) {
      console.log(error);
      return error
    }
  }

  async crawlScheduleData(year: number) {
    try {
      const url = this.config.get('F1_URL') + `/racing/${year}.html`
      const data = await (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);
        
        const dhhData = await page.evaluate(() => {
          const namesHTML = document.getElementsByClassName('event-place')
          const placeIdHTML = document.getElementsByClassName('event-item-wrapper event-item-link')
          const roundsHTML = document.getElementsByTagName('legend')
          const datesHTML = document.getElementsByClassName('date-month f1-uppercase f1-wide--s')
          const monthHTML = document.getElementsByClassName('month-wrapper')
          let minusMonth = 0
          const data = [...namesHTML].map((line, idx) => {
            const placeId = parseInt(placeIdHTML[idx]?.getAttribute('data-meetingkey'))
            const place = line.innerHTML.split(' <')[0]
            const roundText = roundsHTML[idx].innerHTML
            let month = null
            let round
            if (roundText == 'TESTING') {
              round = 0
            }
            else if (roundText.includes('ROUND')) {
              round = parseInt(roundText.split(/[ <]/)[1])
            }
            if ((roundText.includes('UP') || roundText.includes('LIVE')) && monthHTML.length != roundsHTML.length) {
              minusMonth = 1
              month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][new Date().getMonth()]
            } 
            const startDate = datesHTML[idx].getElementsByClassName('start-date')[0].innerHTML
            const endDate = datesHTML[idx].getElementsByClassName('end-date')[0].innerHTML
            
            if (month == null) month = monthHTML[idx - minusMonth].innerHTML

            if (isNaN(round)) return 
            else return {place, round, startDate, endDate, month, placeId}
          })
          return data
        });
        
        await browser.close();
        return dhhData
      }) ();
      
      return {data: data}
    } catch (error) {
      console.log(error);
      
    }
  }
}