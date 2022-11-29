import PropTypes from 'prop-types'
import classNames from 'classnames'

const Icon = ({ type, className, ...rest }) => (
  <svg {...rest} className={classNames('icon', className)} aria-hidden="true">
    <use xlinkHref={`#${type}`}></use>
  </svg>
)

Icon.propTypes = {
  type: PropTypes.string.isRequired,
}

export default Icon
