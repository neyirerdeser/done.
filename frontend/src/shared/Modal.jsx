const Modal = ({ onClose, children }) => {
  return (
    // backdrop
    <div
      onClick={onClose}
      className={`
        fixed inset-0
        bg-violet-950/20
        md:invisible
      `}
    >
      {/* modal */}
      <div
        className={`
          bg-base-200 flex flex-col h-full w-64
        `}
      >
        {children}
      </div>

    </div>
  )
}

export default Modal