import arrow from '../assests/arrow.png'
import done from '../assests/done-purple.png'

const LoginPromt = () => {
  return (
    <div>
      <img src={arrow} />
      <div className='p-6 justify-items-center'>
        <div className='text-primary text-lg'>login now to start getting it</div>
        <img src={done} />
      </div>
    </div>
  )
}

export default LoginPromt