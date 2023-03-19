import {_decorator, ModelRenderer, renderer, pipeline, SpriteFrame, ImageAsset, Texture2D, Vec2 } from "cc";
const { ccclass } = _decorator;

//use default-sprite-renderer-material

@ccclass('TextRenderer')
export class TextRenderer extends ModelRenderer {
    start() {
        const fontSize = 50;
        const fontFamily = 'Arial';
        const string = 'Label\nHello\nWorld';
        const font = `${fontSize}px ${fontFamily}`;

        const lines = string.split('\n');

        const canvas = window.document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;

        let width = 0;
        let height = 0;
        for (const line of lines) {
            const metrics = context.measureText(line);
            width = Math.max(width, metrics.width);
            height = height + fontSize;
        }

        canvas.width = width;
        canvas.height = height;

        // context properties will be reset after setting width/height of canvas
        context.font = font;
        // textAlign and textBaseline have different default value between web and native, we specify one here.
        context.textAlign = 'left';
        context.textBaseline = 'top';

        // hard code startPosition, it should be calculated by textAlign and textBaseline
        const startPosition = new Vec2(0,0)
        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], startPosition.x, startPosition.y + fontSize * i );               
        }

        const spriteFrame = new SpriteFrame();
        const image = new ImageAsset(canvas);
        const texture = new Texture2D()
        texture.image = image;
        spriteFrame.texture = texture;

        const model = new renderer.scene.Model();
        model.enabled = true;
        model.node = model.transform = this.node;
        model.initialize()
        spriteFrame.ensureMeshData()
        const mesh = spriteFrame.mesh!;
        const renderingSubMeshes = mesh.renderingSubMeshes;
        model.createBoundingShape(mesh.struct.minPosition, mesh.struct.maxPosition);
        model.initSubModel(0, renderingSubMeshes[0], this.getRenderMaterial(0));

        const descriptorSet = model.subModels[0].descriptorSet;
        descriptorSet.bindTexture(pipeline.ModelLocalBindings.SAMPLER_SPRITE, spriteFrame.getGFXTexture());
        descriptorSet.bindSampler(pipeline.ModelLocalBindings.SAMPLER_SPRITE, spriteFrame.getGFXSampler());
        descriptorSet.update();

        this.node.scene.renderScene.addModel(model);
        this._models.push(model);
    }
}