import { userAtom } from '@/lib/atom/userAtom';
import { companyQueries } from '@/lib/graphql/company/queries';
import { useQuery } from 'graphql-hooks';
import { useAtomValue } from 'jotai';
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useModal } from '@/hooks/use-modal-store';

const BroadcastDetailsModal = () => {
    const user = useAtomValue(userAtom)
    const { isOpen, onClose, type, data: modalData } = useModal();
    const { broadcastId } = modalData;
    const isModalOpen = isOpen && type === "broadcastDetails";
    const { loading, error, data } = useQuery(companyQueries.GET_BROADCAST_BY_ID, {
        skip: !user?.token || !broadcastId,
        variables: {
            broadcastId: broadcastId
        }
    });

    if (loading) return <div>Loading...</div>

    const handleClose = () => {
        onClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-lg max-h-[80%]">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Broadcast Details
                    </DialogTitle>
                </DialogHeader>
                <div>
                    {/* <div className='mt-2 grid place-content-center'>
                        <img src={data?.getBroadcastById.imgURL[0].url} alt="broadcast" className="w-1/2 " />
                    </div> */}
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '10px' }}>
                        {
                            data?.getBroadcastById.imgURL?.map((image: any, index: number) => (
                                <img key={index} src={image.url} alt='service' style={{ width: '40%', height: '100%', objectFit: 'cover' }} />
                            ))
                        }
                    </div>
                    <div>
                        <div className="text-lg font-bold">Type</div>
                        <div className="text-lg">{data?.getBroadcastById.isOffer ? 'Offer' : data?.getBroadcastById.isTemplate ? 'Template' : 'Message'}</div>
                    </div>
                    <div className="mt-4">
                        <div className="text-lg font-bold">Description</div>
                        <div className="text-lg">{data?.getBroadcastById.message}</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BroadcastDetailsModal