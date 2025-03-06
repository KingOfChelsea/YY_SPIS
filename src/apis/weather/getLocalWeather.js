import axios from 'axios'

// axios.defaults.timeout = 100000

 const getIpAddress = async params => {
  try {
    const res =  await axios.get(`https://api.vvhan.com/api/ipInfo`)
    return res;
  } catch (error) {
    console.log(error);
  }

};

export const getWeather = async params =>{
  try {
    // 关键修改点：添加await
    const ipResponse = await getIpAddress();
    const city = ipResponse.data.info.city;
    const res  = await axios.get(`https://api.vvhan.com/api/weather?city=${city}`)
    // 发起天气请求
    return res ;
  } catch (error) {
    console.error(" 请求失败:", error);
    // throw error; // 抛出错误供调用方处理
  }
}
