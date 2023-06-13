import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('./Pomp'), {
  ssr: false
})

const PompNoSSR = () => <DynamicComponentWithNoSSR />

export default PompNoSSR