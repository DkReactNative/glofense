import {DeviceUUID} from 'device-uuid';
const deviceInfo = () => {
  var uuid = new DeviceUUID().get();
  var du = new DeviceUUID().parse();
  let obj = {};
  obj['device_id'] = uuid;
  obj['device_type'] = 'desktop';
  obj['os'] = du.os;
  obj['isMobile'] = du.isMobile;
  obj['isDesktop'] = du.isDesktop;
  obj['isiPhone'] = du.isiPhone;
  obj['isAndroid'] = du.isAndroid;
  obj['browser'] = du.browser;
  obj['resolution'] = du.resolution;
  return obj;
};
export default deviceInfo;
