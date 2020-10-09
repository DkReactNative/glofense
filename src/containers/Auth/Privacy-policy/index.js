import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {getService} from '../../../services/getService';
import Loader from '../../../components/loader';
import CmsWrapper from '../../../components/cmsWrapper';

const Privacy = (props) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  useEffect(() => {
    dispatch({
      type: 'active_link',
      payload: window.location.pathname.substring(
        window.location.pathname.search('/')
      ),
    });
    getService('get-page-by-slug/privacy-policy')
      .then((response) => {
        console.log(response);
        response = response['data'];
        if (response.success) {
          setTitle(response.result.title);
          document.getElementById('cms-content').innerHTML =
            response.result.content;
        }
      })
      .catch((err) => {});
  });

  return <CmsWrapper title={title} />;
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(Privacy);
