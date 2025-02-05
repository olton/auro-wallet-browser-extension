import './App.scss';
import { getAllRouter as AllRouter } from './router';
import IdleTimer from 'react-idle-timer'
import { sendMsg } from '../utils/commonMsg';
import { WALLET_RESET_LAST_ACTIVE_TIME } from '../constant/msgTypes';
import { useCallback, useEffect, useState } from 'react';
import cls from "classnames"
import { getFeeRecom, getScamList } from '../background/api';
import { updateRecomFee } from '../reducers/cache';
import { useDispatch, useSelector } from 'react-redux';
import { getLocal } from '../background/localStorage';
import { RECOMMOND_FEE, SCAM_LIST } from '../constant/storageKey';
import { updateScamList } from '../reducers/accountReducer';
import { NET_CONFIG_TYPE } from '../constant/network';

function setLastActiveTime(){ 
  sendMsg({
    action: WALLET_RESET_LAST_ACTIVE_TIME,
  }, () => {})
}

function App() {
  const dispatch = useDispatch()
  const netConfig = useSelector(state => state.network.currentConfig)

  const [showFullStatus,setShowFullStatus] = useState(false)
  useEffect(()=>{
    const url = new URL(window.location.href); 
    const dappPageList = ['popup.html#/approve_page','popup.html#/request_sign']
    const ledgerPageList= ['popup.html#/ledger_connect','popup.html#/ledger_page']
    let findIndex = false;
    [...dappPageList,...ledgerPageList].map((path)=>{
      if(url.href.indexOf(path)!==-1){
        findIndex = true
      }
    })
    if (url.pathname.indexOf('popup.html') !==-1 && !findIndex) {
      setShowFullStatus(false)
    }else{
      setShowFullStatus(true)
    }
  },[window.location.href])

  const getLocalFeeList = useCallback(() => {
    let localFeeList = getLocal(RECOMMOND_FEE)
    if (localFeeList) {
      let feeList = JSON.parse(localFeeList)
      dispatch(updateRecomFee(feeList))
    }
  }, [])

  const fetchFeeData = useCallback(async () => {
    getLocalFeeList()
    let feeRecom = await getFeeRecom()
    if (feeRecom.length > 0) {
      dispatch(updateRecomFee(feeRecom))
    }
  }, [])
  const getLocalScamList = useCallback(() => {
    let localScamList = getLocal(SCAM_LIST)
    if (localScamList) {
      let scamList = JSON.parse(localScamList)
      dispatch(updateScamList(scamList))
    }
  }, [])
  const fetchScamList = useCallback(async()=>{
    let scamList = await getScamList()
    if (scamList.length > 0) {
      dispatch(updateScamList(scamList))
    }
  },[])

  const initNetData = useCallback(()=>{
    fetchFeeData()
    const netType = netConfig?.netType
    if(netType === NET_CONFIG_TYPE.Mainnet){
        fetchScamList()  
    }
  },[netConfig])

  useEffect(()=>{
    const netType = netConfig?.netType
    if(netType !== NET_CONFIG_TYPE.Mainnet){
        dispatch(updateScamList([]))
    }else{
      getLocalScamList()
    }
  },[netConfig])

  useEffect(() => {
    initNetData()
  }, [])
  
  return (
    <div className="App">
      <IdleTimer onAction={setLastActiveTime} throttle={1000}>
      <header className={cls("App-header",{
          "App-header-full":showFullStatus
      })}>
        <AllRouter />
      </header>
      </IdleTimer>
    </div>
  );
}
export default App;



