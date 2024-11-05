import * as gfx from 'gophergfx'
import { AnimatedBone } from './AnimatedBone';
import {SkeletonCharacter} from './SkeletonCharacter';


/**
 * This character should draw an Ant or some other interesting custom 3D character by
 * adding geometry to the bones of the character.  We will assume the character's
 * skeleton is a humanoid skeleton in the CMU MoCap database format.  So, you can
 * selectively add geometry to the bone by checking the name of the bone using an
 * "if" statement as demonstrated in the support code.
 */
export class AntCharacter extends SkeletonCharacter
{
    private blackMaterial: gfx.UnlitMaterial;
    private antMaterial: gfx.PhongMaterial;

	private CIRCLE_MESH_RESOLUTION = 20;

    constructor() {
        super();

        this.blackMaterial = new gfx.UnlitMaterial();
        this.blackMaterial.setColor(gfx.Color.BLACK);

        this.antMaterial = new gfx.PhongMaterial();
        this.antMaterial.ambientColor.set(0.7, 0, 0);
        this.antMaterial.diffuseColor.set(0.7, 0, 0);
        this.antMaterial.specularColor.set(0.7, 0.7, 0.7);
        this.antMaterial.shininess = 50;
    }


    public override addGeometryToAnimatedBone(bone: AnimatedBone): void
    {
        // PART 5: Create a character!
        
        // For our ant character, we added special geometries for the following "bones":
        // - lowerback
        // - upperbackback
        // - thorax
        // - head
        // A full list of available bones (and their hierarchical relationships)
        // can be seen in the skeleton files, for example /public/assets/data/05.asf.

		const defaultScale = 0.1;

        if (bone.name == 'lowerback') {
			const circle = this.createCircleMesh()
			circle.setLocalToParentMatrix(gfx.Matrix4.multiplyAll(
				gfx.Matrix4.makeScale(new gfx.Vector3(defaultScale + .03, defaultScale + .13, defaultScale + .03)),
				gfx.Matrix4.makeTranslation(new gfx.Vector3(0, -defaultScale, 0)),
			), false)
			circle.material = this.antMaterial
			bone.add(circle)
        }
        else if (bone.name == 'upperback') {
			const circle = this.createCircleMesh()
			circle.setLocalToParentMatrix(gfx.Matrix4.multiplyAll(
				gfx.Matrix4.makeScale(new gfx.Vector3(defaultScale, defaultScale, defaultScale)),
				gfx.Matrix4.makeTranslation(new gfx.Vector3(0, 1, 0)),
			), false)
			circle.material = this.antMaterial
			bone.add(circle)
        }
        else if (bone.name == 'thorax') {
			const circle = this.createCircleMesh()
			circle.setLocalToParentMatrix(gfx.Matrix4.multiplyAll(
				gfx.Matrix4.makeScale(new gfx.Vector3(defaultScale, defaultScale, defaultScale)),
				gfx.Matrix4.makeTranslation(new gfx.Vector3(0, 1.2, 0)),
			), false)
			circle.material = this.antMaterial
			bone.add(circle)
        }
        else if (bone.name == 'head')  {
			const head = this.createCircleMesh()
			head.setLocalToParentMatrix(gfx.Matrix4.multiplyAll(
				gfx.Matrix4.makeScale(new gfx.Vector3(defaultScale, defaultScale + .07, defaultScale)),
				gfx.Matrix4.makeTranslation(new gfx.Vector3(0, .3, 0)), 
			), false)
			head.material = this.antMaterial

			const eyeScale = .025;
			const leye = this.createCircleMesh()
			leye.setLocalToParentMatrix(gfx.Matrix4.multiplyAll(
				gfx.Matrix4.makeScale(new gfx.Vector3(eyeScale, eyeScale, eyeScale)),
				gfx.Matrix4.makeTranslation(new gfx.Vector3(-1.5, 2, 4)),
			), false)
			leye.material = this.blackMaterial;
			bone.add(leye)

			const reye = this.createCircleMesh()
			reye.setLocalToParentMatrix(gfx.Matrix4.multiplyAll(
				gfx.Matrix4.makeScale(new gfx.Vector3(eyeScale, eyeScale, eyeScale)),
				gfx.Matrix4.makeTranslation(new gfx.Vector3(1.5, 2, 4)),
			), false)
			reye.material = this.blackMaterial;
			bone.add(reye)

			bone.add(head)
        } else {
			const mesh = this.createBoneMesh(bone)
			mesh.material = this.blackMaterial
			bone.add(mesh)
		}
    }

	private createCircleMesh(): gfx.Mesh3 {
		const vert: gfx.Vector3[] = []
		const idx: number[] = [];

		for (let i = 0; i < this.CIRCLE_MESH_RESOLUTION + 1; i++) {
			const x = (i / this.CIRCLE_MESH_RESOLUTION) * Math.PI * 2
			for (let j = 0; j < this.CIRCLE_MESH_RESOLUTION + 1; j++) {
				const y = (j / this.CIRCLE_MESH_RESOLUTION) * Math.PI * 2

				const v = new gfx.Vector3(
					Math.cos(x) * Math.sin(y),
					Math.sin(x),
					Math.cos(x) * Math.cos(y)
				)
				v.normalize()

				vert.push(v);
			}
		}

		for (let i = 0; i < this.CIRCLE_MESH_RESOLUTION ; i++) {
			for (let j = 0; j < this.CIRCLE_MESH_RESOLUTION ; j++) {
				const tl = i * this.CIRCLE_MESH_RESOLUTION + j;
				const tr = tl + 1;
				const bl = tl + this.CIRCLE_MESH_RESOLUTION;
				const br = bl + 1;

				idx.push(tl, bl, tr);
				idx.push(tr, bl, br);
			}
		}

		const mesh = new gfx.Mesh3()
		mesh.setVertices(vert)
		mesh.setNormals(vert) // vertices already normalized
		mesh.setIndices(idx)

		return mesh;
	}
}
