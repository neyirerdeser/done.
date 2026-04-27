const Modal = ({ open, onClose, bgStyling="", fgStyling="", children }) => {
  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0
        bg-violet-950/20
        ${bgStyling}
      `}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`
          bg-base-200
          flex flex-col
          h-full
          transition-all duration-300 delay-150
          ${open ? "opacity-100 scale-100 ease-in" : "opacity-0 scale-95 ease-out"}
          ${fgStyling}
        `}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal