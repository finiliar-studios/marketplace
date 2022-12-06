import { FC } from 'react'

type Props = {}

type PropTwo = {
  headline: string,
  body: string
}

type PropThree = {
  className?: string
}

const Copy: FC<PropTwo> = ({ headline, body}) => {
  return (
    <div>
      <div className="max-w-md">
        <div className="reservoir-h1 mb-3">
          {headline}
        </div>
        <div className="text-xl">
          {body}
        </div>
      </div>
    </div>
  )
}

const Module: FC<PropThree> = ({ className, children }) => {
  return (
    <div className={`flex max-w-[1300px] m-auto ${className}`}>
      {children}
    </div>
  )
}

const HomeContent: FC<Props> = () => {
  const featured = [
    'https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif',
    'https://cdn.finiliar.com/neutral_short_dance/MTA2NwRx70.gif',
    'https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif',
    'https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif',
    'https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif',
    'https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif',
    'https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif',
    'https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif',
    'https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif',
    'https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif',
    'https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif'
  ]
  return (
    <div
      className="pb-11 mb-11 overflow-x-hidden w-[100vw]"
    >
      <Module className="justify-center text-center mt-4">
        <Copy headline='Meet the finiliar' body='The finiliar are digital companions that keep you up to date with the things you care about.' />
      </Module>
      <div className="flex ml-[-50px] mt-[100px] overflow-hidden">
        {featured.map(item => {
          return (
            <div key={item} >
              <img src={item} alt="Example fini" className="rounded-[30px] max-w-[200px] px-2" />
            </div>
          )
        })}
      </div>
      <div className="mt-[300px] left-0">
        <Module className="mt-[200px] z-9 justify-around">
          <Copy headline='A recent discovery' body='The crypto market of 2021 gave rise to a new wave of finiliar that embody various crypto coins. Feeding on the data generated by these coins, the finiliar rejoice when prices are up and sob when they go down. You can own these finiliar as NFTs.' />
          <img
            className="max-w-[400px] ml-16" 
            src="https://cdn.finiliar.com/sad_short_ghost/MTg1NgRx68.gif" alt="Example fini" />
        </Module>
        <img
          src="/graph.svg"
          className="z-[-1] absolute w-[100vw] left-0 right-0 mt-[-400px]" alt="Graph background"
        />
      </div>
      <div className="mt-[300px] left-0">
        <div
          style={{ background: 'linear-gradient(180deg, #edf7e8 0%, #edf7e8 70%, #edf7e800 100%)' }}
          className="max-w-[100vw] h-[600px] absolute z-[-1] left-0 right-0 mt-[-60px]" />
        <Module className="mt-[200px] z-9 justify-around">
          <img
            className="max-w-[600px] mr-[50px]" 
            src="/island.png" alt="Fini island" />
          <Copy headline='Origins' body='The first finiliar were discovered in 2016 by a researcher named Ed Fornieles. Strange code turned out to be a new, adorable species of being. Ed has presented his research around the world as videos and sculptures.' />
        </Module>
      </div>
      <div className="mt-[300px] left-0 mb-[100px]">
        <Module className="mt-[200px] z-9 justify-around">
          <Copy headline='Coming soon' body='Use your iPhone and Apple Watch to save your friends to track your crypto portfolio.' />
          <img
            className="max-w-[300px] mr-[50px]" 
            src="/watch.png" alt="Fini watch app" />
        </Module>
      </div>
    </div>
  )
}

export default HomeContent