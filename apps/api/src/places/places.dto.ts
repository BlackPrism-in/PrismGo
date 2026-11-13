import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class PlaceSearchQuery {
  @ApiProperty({ example: 'Hill Cart Road', description: 'At least 3 characters' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  q: string;
}

export class PlaceDto {
  @ApiProperty({ example: 'Hill Cart Road, Siliguri, West Bengal' }) address: string;
  @ApiProperty({ example: 26.7191 }) lat: number;
  @ApiProperty({ example: 88.4204 }) lng: number;
}
