import axios from 'axios'
import { AppDispatch } from '@/app/store';
import { setAccountData } from '@/app/Slice/accountSlice'
import { setBankData } from '@/app/Slice/bankSlice'
import { setCardsData } from '@/app/Slice/cardsSlice'
import { setTransactionData } from '@/app/Slice/transactionSlice'
import { setUserData } from '@/app/Slice/userSlice'


const fetchUserData = async (dispatch: AppDispatch) => {
    try {
        const response = await axios.get('/api/bank');
        if (response.data.success) {
            const userDetails = response.data.data[0]?.get_user_details_by_token_v2;
            if (userDetails) {
                dispatch(setUserData(userDetails.user));
                dispatch(setBankData(userDetails.banks));
                dispatch(setCardsData(userDetails.cards));
                dispatch(setAccountData(userDetails.accounts));
                dispatch(setTransactionData(userDetails.transactions));
            }
        } else {
            console.error('Failed to fetch user data:', response.data.message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

export default fetchUserData;