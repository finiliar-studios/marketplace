import EthAccount from 'components/EthAccount'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { FiAlertCircle } from 'react-icons/fi'
import { useTokens } from '@reservoir0x/reservoir-kit-ui'
import { Collection } from 'types/reservoir'
import { DownloadButton } from 'components/DownloadButton'
import getAttributeFromTokenDetails from 'lib/getAttributeFromTokenDetails'
import { Cross2Icon } from '@radix-ui/react-icons';
import * as Dialog from '@radix-ui/react-dialog'


type Props = {
  details: ReturnType<typeof useTokens>['data'][0]
  bannedOnOpenSea: boolean
  collection?: Collection
  threeDModel: string
}

type LicensedDownloadComponentProps = {
  link: string
  tokenId?: string
}

function LicensedDownloadComponent({ link, tokenId }: LicensedDownloadComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <div className="flex items-center mt-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        <label className="text-primary-500 text-sm ml-1 items-center"> Click here to agree and certify you have read the License </label>
      </div>
      <div className={`text-primary-500 text-sm inline-flex mt-1 items-center hover:opacity-75 'opacity-100' cursor-pointer`}>
        <a 
        href={link}
        download={`${tokenId}.unitypackage`} 
        className={`text-primary-500 text-sm inline-flex mt-2 items-center hover:opacity-75 ${!checked ? ' opacity-25' : 'opacity-100'}`}
      >
        <img src="/icons/FileSmile.svg" className="h-[16px] mr-[5px]" alt="File icon" />
        <div className="inline-flex">Download 3D Assets </div>
      </a>
      </div>
    </div>
  );
}


const Owner: FC<Props> = ({ details, bannedOnOpenSea, collection, threeDModel }) => {
  const token = details?.token

  const tokenFamily = token && getAttributeFromTokenDetails(token, 'Family')
  const idleLink = token && token?.image!.replace(token?.image!.split('/')[3], tokenFamily + '2')


  console.log({ details })

  const owner =
    token?.kind === 'erc1155' && details?.market?.floorAsk?.maker
      ? details?.market?.floorAsk?.maker
      : token?.owner

  return (
    <div className="col-span-full md:col-span-4 lg:col-span-5 lg:col-start-2">
      <article className="col-span-full pill border-primary-400 rounded-[25px] bg-primary-100 p-6 dark:border-neutral-600 dark:bg-black">
        <div className="reservoir-h3 mb-2 flex items-center gap-4 overflow-hidden font-headings dark:text-white">
          <div>{token?.name ? token?.name.replace('finiliar', 'fini') : `#${token?.tokenId}`}</div>
          {bannedOnOpenSea && (
            <Tooltip.Provider>
              <Tooltip.Root delayDuration={0}>
                <Tooltip.Trigger>
                  <FiAlertCircle className="h-6 w-6 text-[#FF3B3B]" />
                </Tooltip.Trigger>
                <Tooltip.Content
                  sideOffset={5}
                  className="reservoir-body-2 z-[10000] w-[191px] rounded-2xl bg-neutral-800 py-3 px-4 text-center text-white dark:bg-neutral-100 dark:text-black"
                >
                  <Tooltip.Arrow className="fill-neutral-800 dark:fill-neutral-100" />
                  Token is not tradeable on OpenSea
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
        </div>

        <div className="text-primary-700 mb-2 font-headings dark:text-white">
          This fini is a friend of the following human:
        </div>
        {owner && (
          <Link href={`/address/${owner}`} legacyBehavior={true}>
            <a className="inline-block">
              <EthAccount address={owner} side="left" />
            </a>
          </Link>
        )}
        {/* Hiding these for mobile bc they don't seem to work on phones */}
        <div className="mt-2 hidden md:flex md:flex-row md:space-x-5">
          <DownloadButton gifLink={token?.image!} filename={'fini ' + token?.tokenId! + ' animated.gif'}>
            <div className="inline-flex">Download current gif</div>
          </DownloadButton>
          <DownloadButton gifLink={idleLink} filename={'fini ' + token?.tokenId! + ' idle.gif'}>
            <div className="inline-flex">Download idle gif</div>
          </DownloadButton>

           
           <Dialog.Root>
            <Dialog.Trigger asChild>
                <div className={`text-primary-500 text-sm inline-flex mt-2 items-center hover:opacity-75 'opacity-100' cursor-pointer`}>
                  <img src="/icons/FileSmile.svg" className="h-[16px] mr-[5px]" alt="File icon" />
                  Download 3D Assets
                </div>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                  <Dialog.Description>
                  Before downloading these 3D assets, please review the <a rel="noreferrer" target="_blank" href="https://nftstorage.link/ipfs/bafkreiddyrny25yijyqpayekam6z2soysblv7bpj3wawngjd4cftbfco7i">
                    <span className="underline">Finiliar License</span> </a>
                  </Dialog.Description>
                  <LicensedDownloadComponent link={threeDModel} tokenId={token?.tokenId} />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
        </div>
      </article>
    </div>
  )
}

export default Owner
