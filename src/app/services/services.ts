import {dateDataServiceInjectable} from './dateData.service';
import {rateCalcServiceInjectable} from './rate-calc.service';
import {testDataGeneratorServiceInjectable} from './test-data-generator.service';
// import {threadsServiceInjectables} from './ThreadsService';
// import {userServiceInjectables} from './UserService';

export * from './dateData.service';
// export * from './MessagesService';
//  export * from './ThreadsService';
// export * from './UserService';

export var servicesInjectables: Array<any> = [
  dateDataServiceInjectable,
  rateCalcServiceInjectable,
  testDataGeneratorServiceInjectable
];