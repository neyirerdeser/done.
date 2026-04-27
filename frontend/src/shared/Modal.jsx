const Modal = ({ open, onClose, bgStyling="", fgStyling="", left=false, children }) => {
  let translate = "translate-x-full"
  if(left) translate = "-"+translate

  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 z-10
        bg-black/40
        transition-all duration-500
           ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        ${bgStyling}
      `}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`
          bg-base-200
          flex flex-col
          h-full
          transform transition-transform delay-150
          ${open ? "translate-x-0" : `${translate}`}
          ${fgStyling}
        `}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal