import express, { Request, Response, NextFunction } from 'express';
import split = require('@splitsoftware/splitio');

const factory: SplitIO.ISDK = split.SplitFactory({
  core: {
    authorizationKey: 'nq55lgrb95hj46kkupntsjkftao2emesrn5f'
  }
});

const client: SplitIO.IClient = factory.client();

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});


interface LocationWithTimezone {
    location: string;
    timezoneName: string;
    timezoneAbbr: string;
    utcOffset: number;
  };

  const getTreatmentMiddleware = function (request: Request, response: Response, next: NextFunction) {
    const key: SplitIO.SplitKey = <SplitIO.SplitKey>request.headers['authorization'];
    request.treatment = client.getTreatment(key, 'timezone_split');
    next();
  };
  
  const getLocationsWithTimezones = (request: Request, response: Response, next: NextFunction) => {
    let locations: LocationWithTimezone[] = [
      {
        location: 'Germany',
        timezoneName: 'Central European Time',
        timezoneAbbr: 'CET',
        utcOffset: 1
      },
      {
        location: 'China',
        timezoneName: 'China Standard Time',
        timezoneAbbr: 'CST',
        utcOffset: 8
      },
      {
        location: 'Argentina',
        timezoneName: 'Argentina Time',
        timezoneAbbr: 'ART',
        utcOffset: -3
      },
      {
        location: 'Japan',
        timezoneName: 'Japan Standard Time',
        timezoneAbbr: 'JST',
        utcOffset: 9
      }
    ];

    if (request.treatment == 'on')
    locations.push({
      location: 'Kenya',
      timezoneName: 'Eastern Africa Time',
      timezoneAbbr: 'EAT',
      utcOffset: 3
    });
  
    response.status(200).json(locations);
  };
  
  app.get('/timezones', getTreatmentMiddleware, getLocationsWithTimezones);
