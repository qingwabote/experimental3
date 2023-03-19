import { _decorator, ModelRenderer, SpriteFrame, renderer, pipeline } from 'cc';
const { ccclass, property, type } = _decorator;

@ccclass('SpriteRendererCopy')
export class SpriteRendererCopy extends ModelRenderer {
    @property(SpriteFrame)
    private _spriteFrame: SpriteFrame;
    @type(SpriteFrame)
    public get spriteFrame(): SpriteFrame {
        return this._spriteFrame;
    }
    public set spriteFrame(value: SpriteFrame) {
        this._spriteFrame = value;
    }

    private _model:renderer.scene.Model

    start() {
        const model = new renderer.scene.Model();
        model.node = model.transform = this.node;
        model.initialize()
        this._spriteFrame.ensureMeshData()
        const mesh = this._spriteFrame.mesh!;
        const renderingSubMeshes = mesh.renderingSubMeshes;
        model.createBoundingShape(mesh.struct.minPosition, mesh.struct.maxPosition);
        model.initSubModel(0, renderingSubMeshes[0], this.getRenderMaterial(0));
        const texture = this._spriteFrame.getGFXTexture()!;
        const sampler = this._spriteFrame.getGFXSampler();
        const descriptorSet = model.subModels[0].descriptorSet;
        descriptorSet.bindTexture(pipeline.ModelLocalBindings.SAMPLER_SPRITE, texture);
        descriptorSet.bindSampler(pipeline.ModelLocalBindings.SAMPLER_SPRITE, sampler);
        descriptorSet.update();

        model.enabled = true;

        this.node.scene.renderScene.addModel(model);

        this._models.push(model);
        this._model = model;
    }
}


