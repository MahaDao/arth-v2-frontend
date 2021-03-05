import React from 'react'
import { useActivePopups } from '../../state/application/hooks'
import TranscationSnackbar from '../../components/TopBar/components/TranscationSnackbar';


export default function Popups() {
  // get all popups
  const activePopups = useActivePopups()

  return (
    <>
      {activePopups.map(p => (

        <TranscationSnackbar
        notificationCount={1}
        open
        content={p.content}
/>
      ))}
    </>
  )
  // return (
  //   <>

  //     <FixedPopupColumn gap="20px">
  //       {activePopups.map(item => (
  //         <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
  //       ))}
  //     </FixedPopupColumn>
  //     <MobilePopupWrapper height={activePopups?.length > 0 ? 'fit-content' : 0}>
  //       <MobilePopupInner>
  //         {activePopups // reverse so new items up front
  //           .slice(0)
  //           .reverse()
  //           .map(item => (
  //             <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
  //           ))}
  //       </MobilePopupInner>
  //     </MobilePopupWrapper>
  //   </>
  // )
}
