import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';


@Injectable()
export class MapquestService {
  constructor(private readonly httpService: HttpService) { }
  async geoCodeAddress(geoCodeAddressDto: { location: string }) {
    const mapQuestUrl = process.env.MAP_QUEST_API_URL + 'geocoding/v1/address';

    const params = {
      key: process.env.MAP_QUEST_API_KEY,
      location: geoCodeAddressDto.location
    }

    const { data } = await firstValueFrom(
      this.httpService.get(mapQuestUrl, { params }).pipe(
        catchError((error: AxiosError) => {
          Logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    return data.results;
  }

  async routeMatrix(addresses: Array<string>) {
    const mapQuestUrl = process.env.MAP_QUEST_API_URL + 'directions/v2/routematrix';

    const params = {
      key: process.env.MAP_QUEST_API_KEY,
      locations: addresses,
      manyToOne: true,
      unit: 'k'
    }

    const { data } = await firstValueFrom(
      this.httpService.get(mapQuestUrl, { params }).pipe(
        catchError((error: AxiosError) => {
          Logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    return data
  }
}
