import { _decorator, Camera, Component, DirectionalLightComponent, director, EventMouse, Input, input, MeshRenderer, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CSM')
export class CSM extends Component {
    start() {
        const scene = director.getScene();
        const light = scene.getComponentInChildren(DirectionalLightComponent);
        light.node.position = new Vec3(4,4,4);
        light.node.lookAt(Vec3.ZERO);
        // light.csmOptimizationMode = 1

        const camera = scene.getComponentInChildren(Camera);

        const renderers = this.getComponentsInChildren(MeshRenderer)
        for (const render of renderers) {
            render.shadowCastingMode = MeshRenderer.ShadowCastingMode.ON;
        }

        input.on(Input.EventType.MOUSE_WHEEL, (event)=>{
            const delta = new Vec3(0,0,event.getScrollY()/1000);
            Vec3.transformQuat(delta,delta,camera.node.rotation);
            camera.node.position = delta.add(camera.node.position);
        })
    }

    update(deltaTime: number) {
        
    }
}


