import { ClipboardDocumentIcon, UsersIcon } from '@heroicons/react/24/solid';
import { AFFILIATE_STATUS, filterValidationErrors, getAffiliateStatus } from '@richochet/utils/getAffiliateStatus';
import { combineClasses } from '@richochet/utils/helperFunctions';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { ConnectKitButton } from 'connectkit';
import { referralABI } from 'constants/ABIs/referralABI';
import { rexReferralAddress } from 'constants/polygon_config';
import { mumbaiReferral } from 'constants/mumbai_config';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { OutlineButton, SolidButton } from './button';
import Link from './link';
import { optimismReferral } from 'constants/optimism_config';
;

export const Refer = () => {
	const { t } = useTranslation('home');
	const { address, isConnected } = useAccount();
	const [copy, setCopy] = useState('Copy');
	const [refURL, setRefURL] = useState('pro.ricochet-exchange.eth.limo/#/ref/');
	const [status, setStatus] = useState<AFFILIATE_STATUS | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const [currentReferralId, setCurrentReferralId] = useState<string | undefined>();
	const [referral, setReferral] = useState<string>(rexReferralAddress);
	const { chain } = useNetwork();

	useEffect(() => {
		setCurrentReferralId(address?.toLowerCase().slice(0, 10));
	}, [address, isConnected]);

	useEffect(() => {
		if (!chain) return;
		if (chain.id === 80001) {
			setReferral(mumbaiReferral);
		}
		if (chain.id === 137) {
			setReferral(rexReferralAddress);
		}
		if (chain.id === 10) {
			setReferral(optimismReferral);
		}
	}, [chain?.id])

	useEffect(() => {
		(async () => {
			if (address && isConnected && referral) {
				//to-do: line 50 was put there because I have a bug calling address on non matic chains, need to check this
				if (chain?.id !== 137) return setStatus(AFFILIATE_STATUS.INACTIVE);
				const affiliateStatus = await getAffiliateStatus(address, referral, setCurrentReferralId);
				setStatus(affiliateStatus);
			}
		})();
	}, [address, isConnected, referral]);

	useEffect(() => {
		if (status === AFFILIATE_STATUS.REGISTERING && address && isConnected && referral) {
			const interval = setInterval(async () => {
				const affiliateStatus = await getAffiliateStatus(address, referral, setCurrentReferralId);
				setStatus(affiliateStatus);
			}, 5000);
			return () => clearInterval(interval);
		}
	}, [status, address, isConnected, referral]);

	const handleCopy = () => {
		navigator.clipboard
			.writeText(`${refURL}${currentReferralId}`)
			.then(() => {
				setCopy('Copied!');
				setTimeout(() => {
					setCopy('Copy');
				}, 3000);
			})
			.catch();
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setCurrentReferralId(value);
		setValidationErrors(filterValidationErrors(value));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event?.preventDefault();
		setIsLoading(true);
		const config = await prepareWriteContract({
			address: referral as `0x${string}`,
			abi: referralABI,
			functionName: 'applyForAffiliate',
			args: [currentReferralId, currentReferralId],
		});
		const data = await writeContract(config);
		data
			.wait()
			.then((res) => {
				if (res) {
					setStatus(AFFILIATE_STATUS.REGISTERING);
					(async () => {
						const config = await prepareWriteContract({
							address: referral as `0x${string}`,
							abi: referralABI,
							functionName: 'applyForAffiliate',
							args: [currentReferralId, currentReferralId],
							overrides: {
								from: address as `0x${string}`,
							},
						});
						const data = await writeContract(config);
						data.wait().then((res) => setIsLoading(false));
					})();
				}
				setIsLoading(false);
				return;
			})
			.catch((err) => {
				setStatus(AFFILIATE_STATUS.INACTIVE);
				setValidationErrors(['Error registering this url: possible duplicate. Please try another url']);
				console.error(err);
			});
	};

	return (
		<div className='flex flex-col items-center space-y-4'>
			<div className='flex items-center justify-center text-slate-100 space-x-3'>
				<UsersIcon className='h-6 w-6' />
				<p className='uppercase tracking-widest'>{t('refer')}</p>
			</div>
			<p className='text-slate-100'>{t('apply-refer')}</p>
			{isConnected && (status === AFFILIATE_STATUS.INACTIVE || status === AFFILIATE_STATUS.REGISTERING) && (
				<>
					<p className='text-slate-400'>{t('customize-url')}:</p>
					<form onSubmit={handleSubmit} className='w-full space-y-4'>
						<div
							className={combineClasses(
								validationErrors.length > 0 ? 'border-red-700' : 'border-primary-500',
								'inline-flex py-2 pl-3 w-full border rounded-lg'
							)}>
							<div className='w-2/3 text-primary-700 truncate'>
								<span>{refURL}</span>
							</div>
							<input
								type='text'
								defaultValue={currentReferralId}
								onChange={(e) => handleChange(e)}
								className='w-1/3 pl-1 pr-3 text-primary-100 placeholder-primary-500 bg-transparent focus:outline-none dark:placeholder-primary-500 '
								placeholder={`${t('referral-url')}`}
							/>
						</div>
						{validationErrors.map((each) => (
							<p className='text-red-700 text-xs italic' key={each}>
								{t(each)}
							</p>
						))}
						<SolidButton
							type='submit'
							loading={isLoading}
							disabled={isLoading}
							primary={true}
							action={isLoading ? `${t('registering')}...` : t('register-url')}
						/>
					</form>
				</>
			)}
			{!isConnected && (
				<div className='flex flex-col items-center justify-center space-y-4'>
					<p className='text-primary-500'>{t('connect-for-referrals')}.</p>
					<ConnectKitButton.Custom>
						{({ isConnected, show }) => (
							<>
								{!isConnected && (
									<OutlineButton action={`${t('connect-wallet')}`} type='button' handleClick={show}></OutlineButton>
								)}
							</>
						)}
					</ConnectKitButton.Custom>
				</div>
			)}
			{isConnected && status === AFFILIATE_STATUS.AWAITING_VERIFICATION && (
				<div>
					<p>
						{t('Awaiting verification. Come back later or ping us on our discord:')}
						<br />
						<Link
							className='text-slate-200 underline'
							href='https://discord.gg/mss4t2ED3y'
							target='_blank'
							rel='noreferrer'>
							https://discord.gg/mss4t2ED3y
						</Link>
					</p>
				</div>
			)}
			{isConnected && status === AFFILIATE_STATUS.ENABLED && (
				<div className='flex flex-col justify-start items-center gap-1'>
					<p>{t('your-referral-url')}</p>
					<p>{refURL + currentReferralId}</p>
					<button className='flex justify-center items-center gap-1' onClick={handleCopy}>
						<ClipboardDocumentIcon className='h-5 w-5' /> {t(copy)}
					</button>
				</div>
			)}
			<a
				className='inline-flex items-center space-x-1 text-primary-400'
				href='https://docs.ricochet.exchange/readme/referral-program'
				target='_blank'
				rel='noopener noreferrer'>
				<span className='underline'>{t('how-does-it-work')}</span>
			</a>
		</div>
	);
};
