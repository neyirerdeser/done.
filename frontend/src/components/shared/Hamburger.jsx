import { useState } from 'react'
import { Menu, X } from 'lucide-react'

import SidePanel from '../lists/SidePanel'
import Modal from './Modal'

const Hamburger = () => {
    const [open, setOpen] = useState(false)

    return (
        <div>
            <div className='btn btn-ghost mt-2' onClick={() => setOpen(true)}>
                <Menu className='size-8 text-base-100' />
            </div>
            <Modal open={open} onClose={() => { setOpen(false) }} bgStyling='md:opacity-0 md:pointer-events-none' fgStyling='w-64' left={true} >
                <div className='mt-6 btn btn-ghost px-0.5 mx-2 place-self-start' onClick={() => setOpen(false)}>
                    <X className='size-8 text-primary' />
                    <div className='text-primary'>close</div>
                </div>
                <SidePanel />
            </Modal>
        </div>
    )
}

export default Hamburger