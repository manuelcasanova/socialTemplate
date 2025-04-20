
// Styling

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";


export default function ModeratorHideReportedPost({ isNavOpen }) {

  return (

      <td><FontAwesomeIcon title='Hide Comment' style={{ color: 'red', cursor: 'pointer' }} icon={faBan} /></td>

  )
}