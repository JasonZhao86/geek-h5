import classnames from 'classnames'
import PropTypes from 'prop-types'

const Icon = ({ type, className, onClick }) => {
  return (
    <svg
      className={classnames('icon', className)}
      onClick={onClick}
      aria-hidden="true"
    >
      <use xlinkHref={`#${type}`}></use>
    </svg>
  )
}

Icon.propTypes = {
  type: PropTypes.string.isRequired
}

export default Icon
