import { Node, _decorator, sp } from 'cc';

const { ccclass, property } = _decorator;

declare module 'cc' {
	namespace sp {
		interface Skeleton {
			findSkin: (name: string) => boolean;
			getAniTime: (name: string) => number;
			setDataRes: (path: string) => Promise<void>;
			play: (name: string, loop: boolean, delay: number) => Promise<void>;
			addSocket: (name: string, node: Node) => boolean;
		}
	}
}

sp.Skeleton.prototype.findSkin = function (name: string) {
	try {
		for (let i in this.skeletonData.getSkinsEnum()) {
			if (i == name) {
				return true;
			}
		}
		return false;
	} catch (e) {
		return false;
	}
};

sp.Skeleton.prototype.setDataRes = async function (path: string) {
	let data = await maid.asset.load<sp.SkeletonData>(path);
	this.destroyRenderData();
	this.skeletonData = data;
	return;
};

sp.Skeleton.prototype.play = async function (name: string, loop: boolean, timeScale: number) {
	return new Promise((resolve, reject) => {
		this.setToSetupPose();
		this.timeScale = timeScale;
		this.setAnimation(0, name, loop);
		this.setEventListener(((trackEntry: any, event: any) => {
			this.node.emit('spine_event', event.data.name);
		}) as any);
		this.setCompleteListener((trackEntry) => {
			this.node.emit('spine_playOver', name);
			resolve();
		});
	});
};

/**
 * 给spine动画添加挂点
 * @param name  挂点对应的骨骼名称
 * @param node  挂点
 */
sp.Skeleton.prototype.addSocket = function (name: string, node: Node) {
	var bone = this.findBone(name);
	if (!bone) return false;
	var path = bone.data.name;
	while (bone.parent) {
		path = bone.parent.data.name + '/' + path;
		bone = bone.parent;
	}
	var socket = new sp.SpineSocket(path, node);
	this.sockets.push(socket);
	this.sockets = this.sockets;
	return true;
};

sp.Skeleton.prototype.getAniTime = function (name: string) {
	//@ts-ignore
	return spine?.skeletonData?._skeletonCache?.animations?.filter((item) => item.name == name)?.[0]?.duration;
};
