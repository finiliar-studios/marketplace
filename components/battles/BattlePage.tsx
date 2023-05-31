//@ts-nocheck
import {
  NextPage
} from 'next'
import { Unity, useUnityContext } from "react-unity-webgl";
import React, {
  useState,
  useEffect,
  useCallback
} from 'react'
import useInterval from 'hooks/useInterval'

const BattlePage: NextPage = () => {
  const [battle, updateBattle] = useState()
  const [isStarted, updateIsStarted] = useState(false)
  const [creatorFini, updateCreatorFini] = useState()
  const [acceptorFini, updateAcceptorFini] = useState()
  const [winningState, updateWinningState] = useState("")
  const [isEnded, updateIsEnded] = useState(false)
  const [appReady, updateAppReady] = useState(false)

  // SETUP AND START BATTLE ======================
  const { unityProvider, sendMessage, requestFullscreen, isLoaded, loadingProgression, addEventListener, removeEventListener } = useUnityContext({
      loaderUrl: "unityBuild/FinBattles_0.1a_WebGL.loader.js",
      dataUrl: "unityBuild/FinBattles_0.1a_WebGL.data",
      frameworkUrl: "unityBuild/FinBattles_0.1a_WebGL.framework.js",
      codeUrl: "unityBuild/FinBattles_0.1a_WebGL.wasm",
      streamingAssetsUrl: "unityBuild/StreamingAssets"
  });

  // FETCH AND UPDATE BATTLE DATA ================
  const fetchBattle = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const battleId = urlParams.get('id');
    const data = await fetch(`https://finiliar-server-staging.herokuapp.com/battles/${battleId}`);
    const jsonData = await data.json();
    updateBattle(jsonData)
    return jsonData
  }

  useEffect(() => {
    const fetchData = async () => {
      const jsonData = await fetchBattle()

      const creatorFini = await fetch(`https://api.finiliar.com/metadata/${jsonData.creatorFiniId}`);
      const creatorFiniData = await creatorFini.json()
      updateCreatorFini(creatorFiniData)

      const acceptorFini = await fetch(`https://api.finiliar.com/metadata/${jsonData.acceptorFiniId}`);
      const acceptorFiniData = await acceptorFini.json()
      updateAcceptorFini(acceptorFiniData)
    }

    fetchData()
      .catch(console.error);
  }, [])

  // HIDE BUTTONS AND UI ==========================
  useEffect(() => {
    if (isLoaded) {
      sendMessage('JavascriptHook', 'hide_all')
    }
  }, [isLoaded])

  // SET BATTLE IDS (MUST HAVE appReady/"app_ready" EVENT FIRED) ============
  // NOTE: This triggers the "characters_spawned" event when it's finished
  useEffect(() => {
    if (isLoaded && battle && !isStarted && !isEnded && appReady) {
      sendMessage('JavascriptHook', 'set_battle_ids', `${battle.creatorFiniId}, ${battle.acceptorFiniId}`)
    }
  }, [isLoaded, battle, isStarted, appReady])

  // CONSOLE LOG APP DATA ===================
  const log = (data) => {
    console.log("LOG:", data)
  }

  useEffect(() => {
    addEventListener("log_event", log);
    return () => {
      removeEventListener("log_event", log);
    };
  }, [addEventListener, removeEventListener]);

  // HANDLE UNITY APP EVENTS (BOTH app_ready and characters_spawned)
  const handleCharactersLoaded = useCallback(async (eventName) => {
    
    // Track when the app is ready
    if (eventName === "app_ready") {
      updateAppReady(true)
    }

    if (eventName === "characters_spawned") {
      // Once the characters are loaded either start the battle or call the ending sequence straight away
      let battle = await fetchBattle()

      const shouldBeEnded = computeIsEnded(battle)
      if (!isStarted && !shouldBeEnded) {
        sendMessage('JavascriptHook', 'start_opening_sequence')
        updateIsStarted(true)
      } else {
        sendMessage('JavascriptHook', 'start_ending_sequence', battle.winner == battle.creator ? 'right' : 'left')
        updateIsEnded(true)
      }
    }
  }, [sendMessage]);

  useEffect(() => {
    addEventListener("dispatch_event", handleCharactersLoaded);
    return () => {
      removeEventListener("dispatch_event", handleCharactersLoaded);
    };
  }, [addEventListener, removeEventListener, handleCharactersLoaded]);


  // UPDATE BATTLE TO DISPLAY WINNER ======================
  const calculateWinner = async () => {
    await fetchBattle()

    const diff = Math.abs(battle!.creatorAssetDelta - battle.acceptorAssetDelta)
    let newState = ''

    if (diff == 0) return

    if (battle.winner == battle.creator) {
      if (diff > 2) {
        newState = 'left_winning_strongly'
      } else {
        newState = 'left_winning'
      }
    } else {
      if (diff > 2) {
        newState = 'right_winning_strongly'
      } else {
        newState = 'right_winning'
      }
    }

    if (newState != winningState) {
      sendMessage('JavascriptHook', newState)
      updateWinningState(newState)
    }
  }

  useInterval(() => {
    if (isStarted && !isEnded) {
      calculateWinner()
    }
  }, 3000)

  const computeIsEnded = (battle) => {
    const startDate = Date.parse(battle.startTime)
    const endDate = ((startDate / 1000) + battle.duration) * 1000
    return endDate - Date.now() <= 0
  }

  useInterval(() => {
    const calculateEnding = async () => {
      if (computeIsEnded(battle) && !isEnded) {
        sendMessage('JavascriptHook', 'start_ending_sequence', battle.winner == battle.creator ? 'right' : 'left')
        updateIsEnded(true)
      }
    }

    if (isStarted && battle && !isEnded) {
      calculateEnding()
    }
  }, 1000)

    return (
      <div className="battleCanvas" style={{ position: "relative" }}>
        <div style={{ width: "100vw", height: "100vh", display: "flex", position: "absolute"}}>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
            Loading...
          </div>
          <div style={{ background: creatorFini ? creatorFini.background : "gray", flex: 1 }}/>
          <div style={{ background: acceptorFini ? acceptorFini.background : "gray", flex: 1 }}/>
        </div>
        <Unity devicePixelRatio={1.5} unityProvider={unityProvider} style={{ visibility: isStarted || isEnded ? "visible" : "hidden", position: "absolute" }} />
      </div>
    );
}

export default BattlePage