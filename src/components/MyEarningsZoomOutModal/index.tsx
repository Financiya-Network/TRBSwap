import styled from 'styled-components'

import Modal from 'components/Modal'
import EarningsPanel from 'pages/MyEarnings/MyEarningsOverTimePanel'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleMyEarningsZoomOutModal } from 'state/application/hooks'
import { EarningStatsOverTime } from 'types/myEarnings'

const Panel = styled(EarningsPanel)`
  border: none;
`

type Props = {
  isLoading: boolean
  data: EarningStatsOverTime | undefined
}
const MyEarningsZoomOutModal: React.FC<Props> = ({ data, isLoading }) => {
  const isModalOpen = useModalOpen(ApplicationModal.MY_EARNINGS_ZOOM_OUT)
  const toggleOpenThisModal = useToggleMyEarningsZoomOutModal()

  return (
    <Modal
      isOpen={isModalOpen}
      onDismiss={toggleOpenThisModal}
      maxWidth="calc(100vw - 32px)"
      width="100%"
      height="100%"
    >
      <Panel isZoomed isLoading={isLoading} data={data} />
    </Modal>
  )
}

export default MyEarningsZoomOutModal
