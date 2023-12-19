import { AudioClip, AudioSource, Node } from 'cc';
import { Singleton } from '../base/singleton';

export class AudioNode {
	private _volume: number = 1;
	private _volumeScale: number = 1;

	public node: Node;
	public component: AudioSource;
	public loop: boolean = false;
	public audio: string;
	public cb: Function;
	public cbOnec: Function;
	public debug: boolean = false;

	constructor() {
		this.node = new Node();
		this.component = this.node.addComponent(AudioSource);
		// this.node.on(AudioSource.EventType.STARTED, this.onStart, this);
		this.node.on(AudioSource.EventType.ENDED, this.onEnd, this);
	}

	set volume(val) {
		this._volume = val;
	}

	set volumeScale(val) {
		this._volumeScale = val;
	}

	get FinalVolume() {
		return maid.util.math.limit(this._volume * this._volumeScale, 0, 1);
	}

	public play() {
		if (!this.audio) return;
		globalThis.resMgr.loadAudio(
			this.audio,
			(clip: AudioClip) => {
				this.component.volume = this.FinalVolume;
				this.component.clip = clip;
				this.component.play();
			},
			this.debug
		);
	}

	public stop() {
		this.component.stop();
	}

	public rePlay() {
		this.component.play();
	}

	public playShoot() {
		if (!this.audio) return;
		globalThis.resMgr.loadAudio(
			this.audio,
			(clip: AudioClip) => {
				this.component.volume = this.FinalVolume;
				this.component.playOneShot(clip);
				this.onEnd();
			},
			this.debug
		);
	}

	private onEnd() {
		this.cb && this.cb();
		this.cbOnec && this.cbOnec();
		this.cbOnec = () => {};
		if (this.loop) this.play();
		else {
			this.cb = () => {};
		}
	}

	/**切换至 */
	public switchTo(type: string, cb: Function = () => {}) {
		this.component.stop();
		this.audio = type;
		this.play();
		cb && cb();
	}
}

export class AudioManager extends Singleton {
	public BG: AudioNode;
	public Music: AudioNode;
	public Effect: AudioNode;
	public EffectOne: AudioNode;
	public Story: AudioNode;

	constructor() {
		super();
		this.BG = new AudioNode();
		this.Music = new AudioNode();
		this.Effect = new AudioNode();
		this.EffectOne = new AudioNode();
		this.Story = new AudioNode();
	}

	public switchBG(type: string, debug = false) {
		this.BG.loop = true;
		this.BG.debug = debug;
		this.BG.switchTo(type);
	}

	public playMusic(type: string, volume: number, loop: boolean = false, cb: Function = () => {}, debug: boolean = false) {
		this.Music.audio = type;
		this.Music.loop = loop;
		this.Music.cb = cb;
		this.Music.volume = volume;
		this.Music.debug = debug;
		this.Music.play();
	}

	public playEffect(type: string, volume: number, loop: boolean = false, cb?: Function, debug: boolean = false) {
		this.Effect.audio = type;
		this.Effect.loop = loop;
		this.Effect.cb = cb ? cb : () => null;
		this.Effect.volume = volume;
		this.Effect.debug = debug;
		this.Effect.play();
	}

	public playOneShot(type: string, volume: number, cb: Function = () => {}, debug: boolean = false) {
		this.EffectOne.audio = type;
		this.EffectOne.cb = cb;
		this.EffectOne.loop = false;
		this.EffectOne.volume = volume;
		this.EffectOne.debug = debug;
		this.EffectOne.playShoot();
	}

	public playStory(clip: AudioClip, volume: number, cb: Function = () => {}) {
		this.Story.component.volume = volume;
		this.Story.component.clip = clip;
		this.Story.loop = false;
		this.Story.cb = cb;
		this.Story.component.play();
	}
}
