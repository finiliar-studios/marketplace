//@ts-nocheck
import {
  NextPage
} from 'next'
import { useEffect, useState } from 'react'

const GasFini: NextPage = () => {
    const [fini, updateFini] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const minerFini = await fetch('https://api.finiliar.com/gas-etf')
            const jsonData = await minerFini.json()
            updateFini(jsonData)
        }
    
        fetchData()
          .catch(console.error);
    }, [])

    const convertToVideo = (url) => {
        if (url.indexOf('ipfs') > -1) {
            return url.replace('gif', 'mp4')
        } else {
            return url + '?format=mp4'
        }
    }

  return (
    <div >
      <div className="absolute w-[100vw] h-[100vh] z-[97] top-[0px] bg-[#64585b] flex">
        {fini && fini.image &&
            <video autoPlay muted playsInline loop className="w-[100vw] h-[100vh] max-w-[600px] max-h-[600px] m-auto align-middle">
                <source src={convertToVideo(fini.image)} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        }
        </div>
    </div>
  )
}

export default GasFini