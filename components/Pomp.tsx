import { NextPage } from 'next'
import React, {
  FC
} from 'react'
import Link from 'next/link'
import ReactPlayer from 'react-player'

const NAVBAR_LOGO = process.env.NEXT_PUBLIC_NAVBAR_LOGO

const Pomp: FC = () => {
    const logo = NAVBAR_LOGO

    return (
      <div className="bg-black p-1">
        <div className="text-white text-center m-auto font-bold max-w-[1000px] pt-12">
            <img
                src={logo}
                alt="Fini Logo"
                className={`max-h-[250px] w-auto m-auto p-6 max-w-[100vw]`}
            />
            <h1 className="text-white text-6xl p-6 font-bold max-w-[900px] m-auto">Digital friends for everything that matters.</h1>
            <div className="mt-6">
                <div className="bg-[#E57FA4] p-2 px-4 rounded-full inline-block">
                    <a href="https://app.fini.world" target="_blank" rel="noreferrer">
                        <div>Download the app</div>
                    </a>
                </div>
                <div className="border-2 border-[#E57FA4] text-[#E57FA4] p-2 px-4 rounded-full inline-block ml-4">
                    <Link href="/discover">
                        <div>Browse the Finis</div>
                    </Link>
                </div>
            </div>
            <div className="mt-12">
                <div className="inline-block text-4xl">
                    <img src="Vector-1.png" alt="Circle decoration" className="inline-block w-[80px] h-[80px] mr-4" />
                    <span className="mr-4">be part of the test</span>
                    <img src="Vector-3.png" alt="Star decoration" className="inline-block w-[80px] h-[80px] mr-4" />
                    <span className="mr-4">download the app</span>
                    <img src="Vector.png" alt="Star decoration" className="inline-block w-[80px] h-[80px] mr-4" />
                </div>
            </div>
            <div className="relative m-auto mt-12">
                <div className="text-xl inline-block">
                    <span className="pr-2">to test this</span>
                    <img src="Group 61353.png" alt="Circle decoration" className="inline-block w-[100px] mr-4" />
                    <span>you&apos;ll also need to download this app</span>
                    <img src="Group 61354.png" alt="Circle decoration" className="inline-block w-[100px] ml-4" />

                </div>
                <div className="ml-[100px]">
                    <img src="Vector 1165.png" alt="Arrow" className="m-auto w-[400px] hidden md:block" />
                </div>
            </div>
            <div className="mt-[100px] max-w-[100vw] md:max-w-[80vw] h-[400px]">
                <ReactPlayer
                    // style={{ margin: 'auto' }}
                    height='100%'
                    width='100%'
                    controls
                    url='https://vimeo.com/645129742'
                />
            </div>
            <div className="inline-block mt-4 text-4xl">
                <img src="Vector-3.png" alt="Star decoration" className="inline-block w-[80px] h-[80px] mr-4" />
                <span>find out more about the Fini here</span>
                <img src="Vector 1166.png" alt="Arrow" className="w-[200px] inline-block invisible md:visible" />
            </div>
            <div className="mt-[150px]">
                <img
                    src={logo}
                    alt="Fini Logo"
                    className={`h-[100px] w-auto m-auto p-6`}
                />
                {/* <div>Got questions? Contact us</div> */}
                <div className="inline-flex space-x-4 p-6">
                    <a href="https://twitter.com/finidotworld"><div>Twitter</div></a>
                    <a href="https://discord.gg/finidotworld"><div>Discord</div></a>
                    <a href="https://finiliar.mirror.xyz/"><div>Blog</div></a>
                </div>
            </div>
        </div>
      </div>
    )
}

export default Pomp
