
import MessageList from '../../../componments/messageList';
export default function IndexPage({ location }) {
  return <MessageList category={'SYS'} limit={10} />;
}
