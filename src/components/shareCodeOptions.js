import React from 'react';
import {
  FacebookShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  TumblrShareCount,
  HatenaShareCount,
  FacebookShareButton,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  WeiboShareButton,
  PocketShareButton,
  InstapaperShareButton,
  HatenaShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  MailruIcon,
  EmailIcon,
  LivejournalIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
  PocketIcon,
  InstapaperIcon,
  WeiboIcon,
  HatenaIcon,
} from 'react-share';
import Modal from 'react-bootstrap/Modal';
const Share = ({loading = false, code, bonus, onHide, message}) => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    setShow(loading);
    return () => {
      setShow(false);
    };
  }, [loading, code, bonus]);
  if (loading) {
    document.body.classList.add('disabled-event');
    let element = document.getElementsByClassName('modal-content');
    console.log(element);
    for (let i = 0; i < element.length; i++) {
      element[i].classList.add('disabled-event');
    }
  } else {
    document.body.classList.remove('disabled-event');
    let element = document.getElementsByClassName('modal-content');
    for (let i = 0; i < element.length; i++) {
      element[i].classList.remove('disabled-event');
    }
  }
  var shareUrl = message
    ? message
    : `Download the app Glofans and use my invite code ${code} to get a cash Bonus of ${bonus}`;
  const title = 'GloFans';
  return (
    <Modal
      aria-labelledby="exampleModalLabel"
      show={show}
      keyboard={true}
      backdrop={false}
      centered
      onHide={() => {
        console.log('on hide');
        onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">Share code</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="Demo__container">
          <div className="Demo__some-network">
            <FacebookShareButton
              url={shareUrl}
              quote={title}
              className="Demo__some-network__share-button"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <div>
              <FacebookShareCount
                url={shareUrl}
                className="Demo__some-network__share-count"
              >
                {(count) => count}
              </FacebookShareCount>
            </div>
          </div>

          <div className="Demo__some-network">
            <FacebookMessengerShareButton
              url={shareUrl}
              appId="521270401588372"
              className="Demo__some-network__share-button"
            >
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>
          </div>

          <div className="Demo__some-network">
            <TwitterShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>

            <div className="Demo__some-network__share-count">&nbsp;</div>
          </div>

          <div className="Demo__some-network">
            <TelegramShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>

            <div className="Demo__some-network__share-count">&nbsp;</div>
          </div>

          <div className="Demo__some-network">
            <WhatsappShareButton
              url={shareUrl}
              title={title}
              separator=":: "
              className="Demo__some-network__share-button"
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            <div className="Demo__some-network__share-count">&nbsp;</div>
          </div>

          <div className="Demo__some-network">
            <LinkedinShareButton
              url={shareUrl}
              className="Demo__some-network__share-button"
            >
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>

          <div className="Demo__some-network">
            <PinterestShareButton
              url={String(window.location)}
              className="Demo__some-network__share-button"
            >
              <PinterestIcon size={32} round />
            </PinterestShareButton>

            <div>
              <PinterestShareCount
                url={shareUrl}
                className="Demo__some-network__share-count"
              />
            </div>
          </div>

          <div className="Demo__some-network">
            <VKShareButton
              url={shareUrl}
              className="Demo__some-network__share-button"
            >
              <VKIcon size={32} round />
            </VKShareButton>

            <div>
              <VKShareCount
                url={shareUrl}
                className="Demo__some-network__share-count"
              />
            </div>
          </div>

          <div className="Demo__some-network">
            <OKShareButton
              url={shareUrl}
              className="Demo__some-network__share-button"
            >
              <OKIcon size={32} round />
            </OKShareButton>

            <div>
              <OKShareCount
                url={shareUrl}
                className="Demo__some-network__share-count"
              />
            </div>
          </div>

          <div className="Demo__some-network">
            <RedditShareButton
              url={shareUrl}
              title={title}
              windowWidth={660}
              windowHeight={460}
              className="Demo__some-network__share-button"
            >
              <RedditIcon size={32} round />
            </RedditShareButton>

            <div>
              <RedditShareCount
                url={shareUrl}
                className="Demo__some-network__share-count"
              />
            </div>
          </div>

          <div className="Demo__some-network">
            <TumblrShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <TumblrIcon size={32} round />
            </TumblrShareButton>

            <div>
              <TumblrShareCount
                url={shareUrl}
                className="Demo__some-network__share-count"
              />
            </div>
          </div>

          <div className="Demo__some-network">
            <LivejournalShareButton
              url={shareUrl}
              title={title}
              description={shareUrl}
              className="Demo__some-network__share-button"
            >
              <LivejournalIcon size={32} round />
            </LivejournalShareButton>
          </div>

          <div className="Demo__some-network">
            <MailruShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <MailruIcon size={32} round />
            </MailruShareButton>
          </div>

          <div className="Demo__some-network">
            <EmailShareButton
              url={shareUrl}
              subject={title}
              body="body"
              className="Demo__some-network__share-button"
            >
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>
          <div className="Demo__some-network">
            <ViberShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <ViberIcon size={32} round />
            </ViberShareButton>
          </div>

          <div className="Demo__some-network">
            <WorkplaceShareButton
              url={shareUrl}
              quote={title}
              className="Demo__some-network__share-button"
            >
              <WorkplaceIcon size={32} round />
            </WorkplaceShareButton>
          </div>

          <div className="Demo__some-network">
            <LineShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <LineIcon size={32} round />
            </LineShareButton>
          </div>

          <div className="Demo__some-network">
            <WeiboShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <WeiboIcon size={32} round />
            </WeiboShareButton>
          </div>

          <div className="Demo__some-network">
            <PocketShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <PocketIcon size={32} round />
            </PocketShareButton>
          </div>

          <div className="Demo__some-network">
            <InstapaperShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <InstapaperIcon size={32} round />
            </InstapaperShareButton>
          </div>

          <div className="Demo__some-network">
            <HatenaShareButton
              url={shareUrl}
              title={title}
              windowWidth={660}
              windowHeight={460}
              className="Demo__some-network__share-button"
            >
              <HatenaIcon size={32} round />
            </HatenaShareButton>

            <div>
              <HatenaShareCount
                url={shareUrl}
                className="Demo__some-network__share-count"
              />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Share;
