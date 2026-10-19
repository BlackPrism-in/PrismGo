import type { components } from './api-schema';

type S = components['schemas'];

export type Me = S['MeDto'];
export type AuthResponse = S['AuthResponseDto'];
export type RequestOtpResponse = S['RequestOtpResponseDto'];
export type Department = S['DepartmentDto'];
export type CreateDepartment = S['CreateDepartmentDto'];
export type User = S['UserDto'];
export type CreateUser = S['CreateUserDto'];
export type UpdateUser = S['UpdateUserDto'];
export type Vehicle = S['VehicleDto'];
export type CreateVehicle = S['CreateVehicleDto'];
export type UpdateVehicle = S['UpdateVehicleDto'];
export type Driver = S['DriverDto'];
export type CreateDriver = S['CreateDriverDto'];
export type UpdateDriver = S['UpdateDriverDto'];
export type TripRequest = S['RequestDto'];
export type RequestStatus = S['RequestStatus'];
export type CreateRequest = S['CreateRequestDto'];
export type UpdateRequest = S['UpdateRequestDto'];
export type Place = S['LocationDto'];
export type TimelineEntry = S['TimelineEntryDto'];
export type Availability = S['AvailabilityDto'];
export type NotificationItem = S['NotificationDto'];
export type LiveVehicle = S['LiveVehicleDto'];
export type UnlinkedTracker = S['UnlinkedTrackerDto'];
export type TripTrack = S['TripTrackDto'];
