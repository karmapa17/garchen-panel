import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/lib/ReactTestUtils';

export default function touchTap(element) {
  const node = ReactDOM.findDOMNode(element.node);
  return TestUtils.Simulate.touchTap(node);
}
