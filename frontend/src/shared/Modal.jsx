const Modal = ({ onClose, bgStyling="", fgStyling="", children }) => {
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
          w-64
          ${fgStyling}
        `}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal