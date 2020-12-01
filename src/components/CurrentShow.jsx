import React from 'react';
import StarRating from './StarRating';
import styles from './CurrentShow.module.scss';

const CurrentShow = (props) => {
    const imageUrl = ((props.image != null) && (props.image.medium != null)) ? props.image.medium : './no-image.png';
    const title = (props.name != null) ? props.name : 'Untitled';
    const summary = (props.summary != null) ? props.summary : '';
    const rating = (props.rating && props.rating.average != null) ? props.rating.average : 0;

    return (
        <div className={styles.showBlock}>
            <img src={imageUrl} alt='show pic'/>
            <h2>{title}</h2>
            <StarRating rating={rating} />
            <div dangerouslySetInnerHTML={{__html: summary}}></div>
        </div>
    );
}
 
export default CurrentShow;