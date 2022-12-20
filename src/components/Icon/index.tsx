import classNames from 'classnames'

type Props = {
  type: string
  className?: string
  // rest属性为不确定的属性，它里面可能包含onClick属性，如果明确的话，可以定义该属性
  onClick?: () => void
}

const Icon = ({ type, className, ...rest }: Props) => (
  <svg {...rest} className={classNames('icon', className)} aria-hidden="true">
    <use xlinkHref={`#${type}`}></use>
  </svg>
)

// Icon.propTypes = {
//   type: PropTypes.string.isRequired,
// }

export default Icon
