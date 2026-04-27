import { Menu } from 'lucide-react'

const Drawer = ({sidebar, page}) => {
    return (
        <div className="drawer md:drawer-open">
            <input id="sidePanel" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-row  justify-center md:rounded-tl-2xl">
                <label htmlFor="sidePanel" className=" btn btn-ghost mt-5 drawer-button md:hidden">
                    <Menu className='size-8 text-base-100' />
                </label>
                {page}
            </div>
            <div className="drawer-side">
                <label htmlFor="sidePanel" className="drawer-overlay"></label>
                <div className="menu bg-base-200 text-base-content min-h-full w-72 p-4">
                    {sidebar}
                </div>
            </div>
        </div>
    )
}

export default Drawer