import upvoteempty from './img/arrow-up.svg';
import upvotefull from './img/arrow-up-fill.svg';
import downvoteempty from './img/arrow-down.svg';
import downvotefull from './img/arrow-down-fill.svg';

import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { localStorageData, Logout } from './services/auth/localStorageData';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { ImageEndPoint } from './config/config';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

export const Comment = (props) => {
  const { Id } = useParams();

  const localtz = moment.tz.guess();
  const [sumcounter, setSumcounter] = useState(
    props.item.upvotecomments.length - props.item.downvotecomments.length
  );

  //console.log('upvote------', props.item.upvotecomments.length);

  ///console.log('downVote-----------', props.item.downvotecomments.length);

  const [upvotecounter, setUpvotecounter] = useState(
    props.item.upvotecomments.length
  );

  const [downvotecounter, setDownvotecounter] = useState(
    props.item.downvotecomments.length
  );

  const [upvoteimage, setUpvoteimage] = useState(upvoteempty);

  const [downvoteimage, setDownvoteimage] = useState(downvoteempty);

  useEffect(() => {
    props.item.downvotecomments.map((item) => {
      if (item.userId == localStorageData('_id')) {
        setDownvoteimage(downvotefull);
      }
    });
    props.item.upvotecomments.map((item) => {
      if (item.userId == localStorageData('_id')) {
        setUpvoteimage(upvotefull);
      }
    });
  }, []);

  const upvote = () => {
    if (localStorageData('_id')) {
      if (upvoteimage == upvotefull) {
        setUpvoteimage(upvoteempty);
      } else {
        setUpvoteimage(upvotefull);
      }

      setDownvoteimage(downvoteempty);

      //// console.log(data);

      UpvoteOnPost.mutate({
        userId: localStorageData('_id'),
        expId: props.item._id,
        timeZone: localtz,
        dateTime: new Date(),
      });
    } else {
      toast.error('Erstellen Sie ein Profil um fortzufahren');
    }

    // if (upvotecounter == 0) {
    //   setUpvotecounter(upvotecounter + 1);

    //   setSumcounter(sumcounter + 1);
    //   setUpvoteimage(upvotefull);
    //   if (downvotecounter == -1) {
    //     setDownvotecounter(downvotecounter + 1);
    //     setSumcounter(sumcounter + 2);
    //     setDownvoteimage(downvoteempty);
    //   }
    // }

    // if (upvotecounter == 1) {
    //   setUpvotecounter(upvotecounter - 1);

    //   setSumcounter(sumcounter - 1);
    //   setUpvoteimage(upvoteempty);
    // }
  };

  const downvote = () => {
    if (localStorageData('_id')) {
      if (downvoteimage == downvotefull) {
        setDownvoteimage(downvoteempty);
      } else {
        setDownvoteimage(downvotefull);
      }

      setUpvoteimage(upvoteempty);

      //// console.log(data);

      DownvoteOnPost.mutate({
        userId: localStorageData('_id'),
        expId: props.item._id,
        timeZone: localtz,
        dateTime: new Date(),
      });
    } else {
      toast.error('Erstellen Sie ein Profil um fortzufahren');
    }

    // if (downvotecounter == 0) {
    //   setDownvotecounter(downvotecounter - 1);
    //   setSumcounter(sumcounter - 1);
    //   setDownvoteimage(downvotefull);
    //   if (upvotecounter == 1) {
    //     setUpvotecounter(upvotecounter - 1);

    //     setSumcounter(sumcounter - 2);
    //     setUpvoteimage(upvoteempty);
    //   }
    // }

    // if (downvotecounter == -1) {
    //   setDownvotecounter(downvotecounter + 1);
    //   setSumcounter(sumcounter + 1);
    //   setDownvoteimage(downvoteempty);
    // }
  };

  const UpvoteOnPost = useMutation(
    (NewBid) => userServices.commonPostService('/post/upVoteonComment', NewBid),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        ///  console.log('--------------------', res.data.data);
        setUpvotecounter(res.data.data[0].upvotecomments.length);
        setDownvotecounter(res.data.data[0].downvotecomments.length);
        setSumcounter(
          res.data.data[0].upvotecomments.length -
          res.data.data[0].downvotecomments.length
        );
        //// getComments.refetch();
        /// navigate('/');
      },
    }
  );

  const DownvoteOnPost = useMutation(
    (down) => userServices.commonPostService('/post/downVoteonComment', down),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        /// console.log(res.data.data);

        setUpvotecounter(res.data.data[0].upvotecomments.length);
        setDownvotecounter(res.data.data[0].downvotecomments.length);
        setSumcounter(
          res.data.data[0].upvotecomments.length -
          res.data.data[0].downvotecomments.length
        );

        //setUpvotecounter(res.data.data.upVote);
        //setDownvotecounter(res.data.data.downVote);
        /// setSumcounter(res.data.data.upVote - res.data.data.downVote);

        //// getComments.refetch();
        /// navigate('/');
      },
    }
  );

  return (
    <div className='single-comment'>
      <div className='campaign-header campaign-header-comments'>
        <button
          style={{ visibility: 'hidden' }}
          className='btn btn-success button small'
        >
          <img className='clock' src={require('./img/clock-fill.svg')} />
          (Zeit)
        </button>
        <Link
          to={`/melden/`}
          state={{
            //// name: 'comment',
            // Id: props.item._id,
            link: `https://app.lokalspende.org/neuste-kommentare/${props.item._id}`,
          }}
        >
          <img
            className='report-comments'
            src={require('./img/three-dots.svg')}
          />
        </Link>
        <div className='post-creator-div'>
          <Link to={`/profil/${props.item.user[0]._id}`}>
            <button className='btn btn-success button small position-right'>
              <span className='Suggestion-creator-name'>
                {props.item.user[0].fname}
              </span>
              {/*
              <img
                src={
                  props.item.user[0].pic
                    ? ImageEndPoint + props.item.user[0].pic
                    : require('./img/profile.png')
                }
                className='profile-picture'
              />
              */}
            </button>
          </Link>
        </div>
      </div>

      <p className='comment'>{props.item.expereince} </p>

      <div className='interaction-bar interaction-bar-comment'>
        <div className='voting-div-comment'>
          <div>
            {' '}
            <img
              onClick={upvote}
              src={upvoteimage}
              className='voting-button'
              id='upvotebutton'
            />
            <Link
              className='linkblack'
              to={'/upvoter-comments/' + props.item._id}
            >
              <p id='upvotes' className='voting-counter-upanddown '>
                {upvotecounter}
              </p>
            </Link>
          </div>

          {/*
          <p id='votes' className='voting-counter-sum'>
            {sumcounter}
          </p>
*/}

          <div>
            {' '}
            <img
              onClick={downvote}
              src={downvoteimage}
              className='voting-button'
              id='downvotebutton'
            />
            <Link
              className='linkblack'
              to={'/downvoter-comments/' + props.item._id}
            >
              <p id='downvotes' className=' voting-counter-upanddown '>
                {downvotecounter}
              </p>
            </Link>
          </div>
        </div>

        <div className='divider-horizontal-rule-comments'>
        
        </div>

        <Link to='/teilen' state={{ url: '/neuste-kommentare/' + Id }}>
          {' '}
          <img src={require('./img/share.svg')} className='share-button-comment width-left' />
        </Link>
      </div>
    </div>
  );
};
